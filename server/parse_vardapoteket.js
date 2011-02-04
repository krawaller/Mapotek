/*
Vårdapoteket!
Egentligen verkar all nödvändig info finnas på sidan som listar alla apotek, men vafan, jag parsar de apoteksspecifika sidorna.
Har öppettider för vardag, lördag och söndag. Vore enkelt om inte Ängelholmarna hade fritextat åt helvete. Jaja.
Vissa har helgöppettider, men FACK THEM
*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Vårdapoteket" }, function(err, doc){
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
			url =  'http://localhost/mapotek/server/tmp/parse_vardapoteket_2.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var errors = [], ret, lis = $("ul.adress>li"), iframesrc = $("iframe").attr("src");
			ret = {
				namn: getMatch("Name",$("h1").text(),/Vårdapoteket, (.*)/,errors),
				chain: "Vårdapoteket",
				address: {
					street: lis.eq(1).text().replace(/^\s*/g,"").replace(/\s*$/g,""),
					zipcode: getMatch("zipcode",lis.eq(2).text(),/(.*?),/,errors).replace(/\D/g,""),
					city: getMatch("zipcode",lis.eq(2).text(),/,(.*)$/,errors).replace(/^\s*/g,"").replace(/\s*$/g,"")
				},
				phone:lis.eq(3).text().replace(/\D/g,""),
				hours: {
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					sunday: []
				},
				mail: getMatch("mail",lis.eq(5).find("a").attr("href"),/mailto:(.*)/,errors),
				coords: {
					latitude: getMatch("latitude",iframesrc,/&ll=(.*?),/,errors),
					longitude: getMatch("longitude",iframesrc,/&ll=[\d|\.]*,(.*?)&/,errors)
				},
				pic: "http://www.vardapoteket.se"+$("div.butik-images>img").attr("src")
			};
			function addHours(key,time){
				var matcher = {
					"måndag": ["monday"],
					"tisdag": ["tuesday"],
					"onsdag": ["wednesday"],
					"torsdag": ["thursday"],
					"fredag": ["friday"],
					"fred": ["friday"],
					"lördag": ["saturday"],
					"lördagar": ["saturday"],
					"söndag": ["sunday"],
					"söndagar": ["sunday"],
					"mån-fre": ["monday","tuesday","wednesday","thursday","friday"],
					"vardagar": ["monday","tuesday","wednesday","thursday","friday"],
					"mån-tors": ["monday","tuesday","wednesday","thursday"]
				};
				if (!key || !time){
					errors.push("Strange hours parsing! "+key+", "+time);
					return;
				}
				var times = time.match(/\d?\d:\d\d/g);
				if (matcher[key]){
					if (times && times.length == 2){
						matcher[key].map(function(d){
						//	console.log(d,times);
							ret.hours[d].push(times);
						});
					}
				}
				else {
					errors.push("Unknown day "+key);
				}
			}
			var rows = $("table.oppettider").eq(0).find("tr"), day, time;
			for(var r = 1;r<rows.length;r++){
				var row = rows.eq(r);
				day = row.find("td").eq(0).text().toLowerCase();
				time = row.find("td").eq(1).text().toLowerCase();
				if (day !== "helgdagar"){
					var multimatch = time.match(/[^,| ]{3,} \d?\d:\d\d.{0,}?\d?\d:\d\d/g)
					if (multimatch){ // morons have written lots of stuff in the same field (Ängelholm)
						multimatch.map(function(m){
							var multiday = getMatch("multikey",m,/\D{3,}/g,errors).replace(" ",""),
								multitime = getMatch("multikey",m,/\d?\d:\d\d.{0,}?\d?\d:\d\d/g,errors);
							addHours(multiday,multitime);
						});
					}
					else {
						addHours(day,time);
					}
				}
			}
			ret.errors = errors;			
			console.log(ret);
		});
	});
});
