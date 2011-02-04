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

function parseStore(err, $) {
    if (err) {throw err;}
	var ret = {},
	    info = $(".pharmacy-information .content"),
		vcard = info.eq(1),
		addr = vcard.find(".adr"),
		times = info.eq(0),
		hours = times.find("dd"),
		offset = {"Söndag":3,"Måndag":4,"Tisdag":5,"Onsdag":6,"Torsdag":7,"Fredag":8,"Lördag":9}[times.find("dt").eq(2).text()],
		days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
	ret = {
		chain: "Apotek Hjärtat",
		address: {
			street: addr.find(".street-address").eq(0).text(),
			zipcode: addr.find(".postal-code").eq(0).text(),
			city: addr.find(".locality").eq(0).text()
		},
		phone: vcard.find(".tel > span").text().replace(/\D/g,""),
		coords: {
			latitude: vcard.find("#pharmacy-lat").text(),
			longitude: vcard.find("#pharmacy-long").text()
		},
		hours: {},
		pic: $("div.image>img").eq(1).attr("src")
	};
	
	ret.name = ret.address.street.replace(/\d/g,"").replace(/ *$/g,"")+" "+ret.address.city;
	var rTime = /([\d]{1,2}):([\d]{1,2})-([\d]{1,2}):([\d]{1,2})/g;
	for(var i=0;i<=6;i++){
		var spans = [], s = hours.eq((i+offset) % 7).text(), m;
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

apotek.byChain("Apotek Hjärtat", function(stores){
	stores.forEach(scrapeStore);
});
