/*
Doc Morris!
Någorlunda straightforward. Utgår ifrån att de alltid kör Vardagar Lördag Söndag, och inget lunchbapp
*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Doc Morris" }, function(err, doc){
	function getMatch(what,source,regexp,errors){
		var match = source.match(regexp);
		if (match && match.length>0){
			return match[match.length>1?1:0];
		}
		errors.push("Couldn't find "+what+" in "+source);
		return "";
	}
	function ensureOkString(what,str,errors, longisok){
		if (!str){
			errors.push("Couldn't find "+what+"!");
		}
		if (!longisok && str.length > 30){
			errors.push(what+" is suspiciously long!");
		}
		return str || "";
	}
	//doc.rows.forEach(function(row, i){                 // commenting out since doc has no rows! :)
		//if(i != 0){ return; } // just one for now
		var //obj = row.value,
			url =  'http://localhost/mapotek/server/tmp/parse_docmorris_2.html'; // should be obj.href
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var errors = [], 
				ret,
				article = $("div.article"),
				coordcode = $("skript",article).eq(1).text(),
				info = article.find("div.addresslist").text(),
				contactpara = article.find(">p").text(),
				address = getMatch("adresstring",info,/^(.*?)[A-ZÅÄÖ][a-zåäö]*?:/,errors),
				times = info.substr(address.length);
			ret = {
				name: ensureOkString("name",article.find("h1").text().replace(/\s*$/,""),errors),
				chain: "Doc Morris",
				address: {
					street: getMatch("street",address,/^(.*?)\d\d\d\s*\d\d/,errors).replace(/,\s*$/g,""),
					zipcode: getMatch("zipcode",address,/(\d\d\d\s*\d\d)/,errors).replace(" ",""),
					city: getMatch("city",address,/\d\d\d\s*\d\d\s*(.*)$/,errors)
				},
				phone: getMatch("phone",contactpara,/Telefon:(.*?)Fax/,errors).replace(/\D/g,""),
				hours: {
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					sunday: []
				},
				mail: getMatch("mail",contactpara,/E-post:(.*)/,errors).replace(/\s/g,""),
				coords: {
					latitude: getMatch("latitude",coordcode,/var latlng = new google\.maps\.LatLng\((.*?),/,errors),
					longitude: getMatch("longitude",coordcode,/var latlng = new google\.maps\.LatLng\(.*?,(.*?)\)/,errors)
				}
			};
			times.split(",").map(function(t){
				var day = getMatch("day",t,/^(.*?):/,errors).toLowerCase().replace("ö","o").replace(" ",""),
					span = [getMatch("open",t,/:(.*?)-/,errors),getMatch("close",t,/-(.*)/,errors)],
					matcher = {
						"vardagar": ["monday","tuesday","wednesday","thursday","friday"],
						"lordag": ["saturday"],
						"lordagar": ["saturday"],
						"sondag": ["sunday"],
						"sondagar": ["sunday"]
					};
				if ((!span) || (span.length != 2)){
					errors.push("Weird time "+t);
					return;
				}
				for(var i=0;i<2;i++){
					span[i] = span[i].replace(".",":").replace(" ","");
					if (span[i].length<4){
						span[i] = span[i]+":00";
					}
					if (span[i].length==4){
						span[i] = "0"+span[i];
					}
				}
				if (matcher.hasOwnProperty(day)){
					matcher[day].map(function(d){
						ret.hours[d] = span;
					});
				}
				else {
					errors.push("Unknown day "+day);
				}
			});
			if (ret.hours.monday.length + ret.hours.tuesday.length + ret.hours.wednesday.length + ret.hours.thursday.length + ret.hours.friday.length + ret.hours.saturday.length + ret.hours.sunday.length < 1){
				errors.push("No opening hours?!");
			}
			ret.errors = errors;			
			console.log(ret);
		});
	//});
});
