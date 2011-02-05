var scraper = require('./scraper'),
	apotek = require('./apotek');
	
String.prototype.times = function(n) {
	var s = '';
	for (var i = 0; i < n; i++)
		s += this;
	return s;
};

String.prototype.zp = function(n) { return '0'.times(n - this.length) + this; };
Number.prototype.zp = function(n) { return this.toString().zp(n); };	
	
var rTime = /([\d]{1,2}):([\d]{1,2})\s*-\s*([\d]{1,2}):([\d]{1,2})/g;	
function parseStore(err, $) {
	function ensureOkString(what,str,errors, longisok){
		if (!str){
			errors.push("Couldn't find "+what+"!");
		}
		if (!longisok && str.length > 30){
			errors.push(what+" is suspiciously long!");
		}
		return str || "";
	}
    if (err) {throw err;}
	var ret,
		res = $('.hitta_001'),
		d = ($('.hitta_001:eq(0) tr:eq(2) td:eq(0)').text().trim().match(/^([^\s]+)/)||[null,null])[1],
		offset = {"Söndag":3,"Måndag":4,"Tisdag":5,"Onsdag":6,"Torsdag":7,"Fredag":8,"Lördag":9}[d],
		days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
		hours = res.eq(0).find('tr'),
		addressParts = res.eq(2).find('p').text().trim().match(/([^\r\n]+)[\r\n\s]*(\d{5})\s*([^$]+)/)||[null,null,null,null],
		pos = $('#googlemap img').attr('src').match(/markers=([\d.]+),([\d.]+)/)||[null,null,null],
		s,
		errors = [];
		
	ret = {
		name: ensureOkString("name",$('.pagetitle h1').text().trim(),errors),
		chain: "Apoteket AB",
		address: {
			street: ensureOkString("street",addressParts[1],errors),
			zipcode:  ensureOkString("zipcode",addressParts[2],errors),
			city:  ensureOkString("city",addressParts[3],errors)
		},
		coords: {
			latitude: ensurOkString("latitude",pos[1],errors),
			longitude: ensureOkString("longitude",pos[2],errors)
		},
		phone: ensureOkString("phone",res.eq(1).find('td:eq(1)').text().replace(/\D+/g, ''),errors),
		hours: {}
	};
	
	for(var i=0;i<=6;i++){
		var spans = [], s = hours.eq((i+offset) % 7).find('td:eq(1)').text().trim(), m;
		while(m = rTime.exec(s)){
			spans.push([m[1].zp(2)+':'+m[2].zp(2), m[3].zp(2)+':'+m[4].zp(2)]);
		}
		ret.hours[days[i]] = spans;
	}
	if (ret.hours.monday.length + ret.hours.tuesday.length + ret.hours.wednesday.length + ret.hours.thursday.length + ret.hours.friday.length + ret.hours.saturday.length + ret.hours.sunday.length < 1){
		errors.push("No opening hours?!");
	}
	ret.errors = errors;
	apotek.save(ret);
}

function scrapeStore(store){
	scraper(store.href, parseStore);
}

apotek.byChain("Apoteket AB", function(stores){
	stores.forEach(scrapeStore);
});

