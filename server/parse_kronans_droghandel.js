var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Kronans Droghandel" }, function(err, doc){
	doc.rows.forEach(function(row, i){
		if(i != 0){ return; } // just one for now
		var obj = row.value,
			url =  'http://localhost/mapotek/server/tmp/parse_kronans_droghandel.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var info = $(".apoteksinfo"), rows = info.contents(), ret, text = rows.text(), imgsrc = $(".apoteksinforight img").attr("src");
			ret = {
				namn: $("h1").eq(0).text(),
				chain: "Kronans Droghandel",
				address: {},
				hours: {},
				coords: {}
			};
			
			// fetch street from swamp
			var street = text.match(/Adress\r\n\s*(.*)?\s*\r\n/);
			ret.address.street = (street.length >= 2 ? street[1] : "").replace(/\s$|\u00a0|,/g,"");

			// fetch zipcode from bog
			var zipcode = text.match(/Adress\r\n.*\r\n(.*)\r\n/);
			ret.address.zipcode = (zipcode.length >= 2 ? zipcode[1] : "").replace(/\s|\u00a0|,/g,"");
			
			// fetch city from muck
			var city = text.match(/Adress\r\n.*\r\n.*\r\n(.*)\r\n/);
			ret.address.city = (city.length >= 2 ? city[1] : "").replace(/\s|\u00a0|,/g,"");
						
			// fetch phonenumber from poo, even though we already fakking know it
			var phone = text.match(/Tel:\s?(.*)\r\n/);
			ret.phone = (phone.length >= 2 ? phone[1] : "").replace(/\s|\u00a0|,|\u2013/g,"");
			
			// fetch coords from puss
			var c = imgsrc.match(/markers=(.*?),/);
			ret.coords.latitude = (c.length >= 2 ? c[1] : "");
			c = imgsrc.match(/markers=.*,(.*),/);
			ret.coords.longitude = (c.length >= 2 ? c[1] : "");
			
			var times = ( text.match(/Öppettider([\s\S]*?)Övrig information/g) || [""])[0].match(/\r\n(.*?:.*)\r\n/g);
			times.map(function(t){ // t is something like: '\r\n        M\u00e5n-Fre: 09.00-17.00\r\n'
			    t = t.replace(/^\r?\n?\s*/g,"").replace(/\r?\n?$/g,"");
				var day = t.match(/^(.*?):/), span = t.match(/\d?\d\.\d\d-\d?\d\.\d\d/g) || [];
				var matcher = {
					"Måndag": ["monday"],
					"Tisdag": ["tuesday"],
					"Onsdag": ["wednesday"],
					"Torsdag": ["thursday"],
					"Fredag": ["friday"],
					"Lördag": ["saturday"],
					"Söndag": ["sunday"],
					"Mån-Fre": ["monday","tuesday","wednesday","thursday","friday"]
				};
				if (day && day.length > 1 && matcher.hasOwnProperty(day[1])){
					matcher[day[1]].map(function(d){
						ret.hours[d] = span.slice(0);
					});
				}
			});
						
			console.log(ret);
		});
	});
});
