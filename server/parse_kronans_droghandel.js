/*
Kronans droghandel weeee!
Horribel kod, så regexpar istället för att jquerya. Verkar konsekvent ha post för Mån-Fre i ett.
Norrfjärden har fritext om speciella stängningstider, men går ej att förutse eller parsa. Fakk it.

*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Kronans Droghandel" }, function(err, doc){
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
			url =  'http://localhost/mapotek/server/tmp/parse_kronans_droghandel.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var errors = [], info = $(".apoteksinfo"), rows = info.contents(), ret, text = rows.text(), imgsrc = $(".apoteksinforight img").attr("src");
			ret = {
				namn: $("h1").eq(0).text(),
				chain: "Kronans Droghandel",
				address: {
					street: getMatch("Street",text,/Adress\r\n\s*(.*)?\s*\r\n/,errors).replace(/\s$|\u00a0|,/g,""),
					zipcode: getMatch("zipcode",text,/Adress\r\n.*\r\n(.*)\r\n/,errors).replace(/\s|\u00a0|,/g,""),
					city: getMatch("city",text,/Adress\r\n.*\r\n.*\r\n(.*)\r\n/,errors).replace(/\s|\u00a0|,/g,"")
				},
				phone: getMatch("phone",text,/Tel:\s?(.*)\r\n/,errors).replace(/\s|\u00a0|,|\u2013/g,""),
				hours: {},
				coords: {
					latitude: getMatch("latitude",imgsrc,/markers=(.*?),/,errors),
					longitude: getMatch("longitude",imgsrc,/markers=.*,(.*),/,errors)
				}
			};
			
			var times = getMatch("opening hours",text,/Öppettider([\s\S]*?)Övrig information/g,errors).match(/\r\n(.*?:.*)\r\n/g) || [];
			times.map(function(t){ // t is something like: '\r\n        M\u00e5n-Fre: 09.00-17.00\r\n'
			    t = t.replace(/^\r?\n?\s*/g,"").replace(/\r?\n?$/g,"");
				var day = getMatch("day",t,/^(.*?):/,errors),
					span = t.match(/\d?\d\.\d\d-\d?\d\.\d\d/g) || [];
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
				if (day && matcher.hasOwnProperty(day)){
					matcher[day].map(function(d){
						ret.hours[d] = span.slice(0);
					});
				}
				else {
					errors.push("Unknown day "+day);
				}
			});
			ret.errors = errors;			
			console.log(ret);
		});
	});
});
