var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Apotek Hjärtat" }, function(err, doc){
	doc.rows.forEach(function(row, i){
		if(i != 0){ return; } // just one for now
		var obj = row.value,
			url =  'http://localhost/mapotek/server/tmp/parse_apotek_hjartat_2.html'; // should be obj.href
		
		scraper(url, function(err, $) {
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
				hours: {}
			};
			ret.name = ret.address.street.replace(/\d/g,"").replace(/ *$/g,"")+" "+ret.address.city;
			for(var i=0;i<=6;i++){
				var spans = [], matches = hours.eq((i+offset) % 7).text().match(/\d\d:\d\d-\d\d:\d\d/g);
				if (matches && matches.length){
					matches.map(function(m){
						spans.push([m.substr(0,5),m.substr(7)]);
					});
				};
				ret.hours[days[i]] = spans;
			}
			console.log(ret);
		});
	});
});
