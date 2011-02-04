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
    if (err) {throw err}
	var ret,
		res = $('.hitta_001'),
		d = ($('.hitta_001:eq(0) tr:eq(2) td:eq(0)').text().trim().match(/^([^\s]+)/)||[null,null])[1],
		offset = {"Söndag":3,"Måndag":4,"Tisdag":5,"Onsdag":6,"Torsdag":7,"Fredag":8,"Lördag":9}[d],
		days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
		hours = res.eq(0).find('tr'),
		addressParts = res.eq(2).find('p').text().trim().match(/([^\r\n]+)[\r\n\s]*(\d{5})\s*([^$]+)/)||[null,null,null,null],
		pos = $('#googlemap img').attr('src').match(/markers=([\d.]+),([\d.]+)/)||[null,null,null],
		s;
		
	ret = {
		name: $('.pagetitle h1').text().trim(),
		chain: "Apoteket AB",
		address: {
			street: addressParts[1],
			zipcode:  addressParts[2],
			city:  addressParts[3]
		},
		coords: {
			latitude: pos[1],
			longitude: pos[2]
		},
		phone: res.eq(1).find('td:eq(1)').text().replace(/\D+/g, ''),
		hours: {}
	};
	
	for(var i=0;i<=6;i++){
		var spans = [], s = hours.eq((i+offset) % 7).find('td:eq(1)').text().trim(), m;
		while(m = rTime.exec(s)){
			spans.push([m[1].zp(2)+':'+m[2].zp(2), m[3].zp(2)+':'+m[4].zp(2)]);
		}
		ret.hours[days[i]] = spans;
	}
	
	apotek.save(ret);
}

function scrapeStore(store){
	scraper(store.href, parseStore);
}

apotek.byChain("Apoteket AB", function(stores){
	stores.forEach(scrapeStore);
});

