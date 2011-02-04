/*
Cura dårå! Observera att jag vill parsa det individuella apotekets KONTAKTSIDA, och ingenting annat. Fjompkop.
Verkar som att de allihop har samma öppettider alla dagar? Hmm.
Kontaktinfolistan innehåller ibland fax, ibland inte. Careful!

OBS! Ingen jävla geoinfo! No coords! :(
*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Cura" }, function(err, doc){
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
			url =  'http://localhost/mapotek/server/tmp/parse_cura_4.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var errors = [], ret,
				globaltime = getMatch("globaltime",$("div.store-info > ul.opening-hours > li").text(),/Alla dagar[ |\u00a0](.*)$/,errors),
				globalopen = getMatch("globalopen",globaltime,/(.*?)-/,errors)+":00",
				globalclose = getMatch("globalclose",globaltime,/-(.*)$/,errors)+":00",
				text = $("ul.curatogostaff>li>div>div").text();
			if (globalopen.length == 4){
				globalopen = "0"+globalopen;
			}
			if (globalopen.length !== 5 || globalclose.length !== 5){
				errors.push("Strange times! "+globalopen+" "+globalclose);
			}
			ret = {
				namn: getMatch("name",$("div.textarea > div.text").text(),/apotekschef.*?Cura apoteket (.*)$/,errors),
				chain: "Cura",
				address: {
					street: getMatch("street",text,/Adress(.*?)\d{3} \d{2} (.*?)E-post/,errors).replace(/,\s*$/g,""),
					zipcode: getMatch("zipcode",text,/(\d{3} \d{2}) (.*?)E-post/,errors).replace(/\D/g,""),
					city: getMatch("city",text,/(\D*?)E-post/,errors)
				},
				phone: getMatch("phone",text,/Telefon(.*?)[Fax|Adress]/,errors).replace(/\D/g,""),
				hours: {
					monday: [[globalopen,globalclose]],
					tuesday: [[globalopen,globalclose]],
					wednesday: [[globalopen,globalclose]],
					thursday: [[globalopen,globalclose]],
					friday: [[globalopen,globalclose]],
					saturday: [[globalopen,globalclose]],
					sunday: [[globalopen,globalclose]]
				},
				mail: getMatch("mail",text,/\r\n\s*(.*)\r\n\s*$/,errors),
				coords: {
					latitude: "",
					longitude: ""
				}
			};
			ret.errors = errors;			
			console.log(ret);
		});
	});
});
