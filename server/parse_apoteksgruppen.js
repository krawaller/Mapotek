/*
Apoteksgruppen! Allt i en enda lista, precis som du sett. Så antar att infrastrukturen här blir lite annorlunda. Har inte
idats fundera ut hur annorlunda, utan behåller samma upplägg utifrån att dokumentet som jag får är den divtag som finns inuti varje tr
för varje butik.

Kartan verkar pluppas in dynamiskt! Hittar bara latitud i urspungskoden... :P

Ibland lunchstängt!
*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Apoteksgruppen" }, function(err, doc){
	function getMatch(what,source,regexp,errors){
		var match = source.match(regexp);
		if (match && match.length>0){
			return match[match.length>1?1:0];
		}
		errors.push("Couldn't find "+what+" in "+source);
		return "";
	}
	doc.rows.forEach(function(row, i){
		if(i != 0){ return; } // just one for now
		var obj = row.value,
			url =  'http://localhost/mapotek/server/tmp/parse_apoteksgruppen.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var errors = [], ret, 
				address = $(".toggletext > p").eq(1).find("span").text(),
				dayrows = $(".toggletext > table > tr");
			console.log(dayrows.length);
			ret = {
				namn: $("h2 > span").eq(0).text().replace("Apoteket ",""),
				chain: "Apoteksgruppen",
				address: {
					street: $("h2 > span").eq(2).text(),
					zipcode: getMatch("zipcode",address,/\d\d\d\s*\d\d/,errors),
					city: $("h2 > span").eq(1).text()
				},
				phone: $(".toggletext > p").eq(0).find("strong").text().replace(/\D/g,""),
				hours: {
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					sunday: []
				},
				coords: {
					latitude: getMatch("latitude",$("input").attr("value"),/lat=(.*)$/,errors),
					longitude: ""
				}
			};
			for(var r = 0;r<dayrows.length;r++){
				var tds = dayrows.eq(r).find("td"),
					matcher = {
						"Mån":["monday"],
						"Tis":["tuesday"],
						"Ons":["wednesday"],
						"Tor":["thursday"],
						"Tors":["thursday"],
						"Fre":["friday"],
						"Lör":["saturday"],
						"Sön":["sunday"]
					},
					day = tds.eq(0).find("strong").text(),
					rdays = matcher[day],
					timestr = tds.eq(2).find("strong").text();
				if (rdays){
					rdays.map(function(d){
						console.log("OK, checking ",d,timestr);
						var spans = timestr.match(/\d\d:\d\d-\d\d:\d\d/g);
						if (spans && spans.length){
							spans.map(function(s){
								var open = getMatch("open",s,/(\d\d:\d\d)-/,errors),
									close = getMatch("open",s,/-(\d\d:\d\d)/,errors);
								ret.hours[d].push([open,close]);
								console.log(d,open,close);
							});
						}
					});
				}
				else {
					errors.push("Unknown day "+day);
				}
			}
			ret.errors = errors;			
			console.log(ret);
		});
	});
});
