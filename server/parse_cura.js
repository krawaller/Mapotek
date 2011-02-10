/*
Cura dårå! Observera att jag vill parsa det individuella apotekets KONTAKTSIDA, och ingenting annat. Fjompkop.
Verkar som att de allihop har samma öppettider alla dagar? Hmm.
Kontaktinfolistan innehåller ibland fax, ibland inte. Careful!

apotekslista på http://www.ica.se/curaapoteket

OBS! Ingen jävla geoinfo! No coords! :( Hämtar manuellt.
	
Observera att apotekets NAMN är lite inkonsekvent. Hämtar det från rubriken uppe till vänster på kontaktsidan!
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
	function ensureOkString(what,str,errors, longisok){
		if (!str){
			errors.push("Couldn't find "+what+"!");
		}
		if (!longisok && str.length > 30){
			errors.push(what+" is suspiciously long!");
		}
		return str || "";
	}
	doc.rows.forEach(function(row, i){
		if(i != 0){ return; } // just one for now
		var obj = row.value,
			url =  'http://localhost/mapotek/server/tmp/parse_cura_2.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err;}
			var coords = { // Hämtar manuellt genom att söka på http://www.koordinater.se där de flesta ica verkar finnas.
				"Alingsås": ["57.92401","12.54588"], //  44117
				"Botkyrka": ["59.23704","17,83116"], //  14563
				"Eskilstuna": ["59.38790","16.53505"], //  63108
				"Gävle": ["60.64843","17.14905"], //  80006
				"Göteborg": ["57.68005","12.00409"],  //  41263
				"Flygstaden Halmstad": ["56.67944","12.80618"], //  30241 
				"Högskolan, Halmstad": ["56.66463","12.87802"],  //  30250
				"Haninge": ["59.1765","18.1617"], //  13647   (59.18439, 18.15896).    skumt! enirokoordinaterna ligger mitt på en väg, men det är en ica-logga där. koordinaterna från koordinat.se däremot ligger vid ett hus. kanske de är rätt ändå?
				"Helsingborg": ["56.06538","12.71969"], // 25457
				"Häggvik": ["59.43812","17.93159"], // 19162
				"Jönköping": ["57.77191","14.17669"], // 55303
				"Hässleholm": ["56.16339","13.77951"], // 28141
				"Högsbo": ["57.65072","11.94609"],  // 42132
				"Karlskrona": ["56.19709","15.64069"], // 37162  (enligt eniro 37160, men vafan)
				"Kungsbacka": ["57.51639","12.07514"], // 43439
				"Kungälv": ["57.87452","11.97350"], // 44234
				"Linköping": ["58.43318","15.59016"], // 581 15 (enligt eniro 58273)
				"Luleå": ["65.61762","22.04860"], // 97345   (OBS! felaktigt inskrivet som 974345 på hemsidan!!)
				"Malmö": ["55.57309","13.03708"], // 21363
				"Mellbystrand": ["56.50333","12.95619"], // 31206 (platsen lite oklar, men måste stämma tycker jag...)
				"Mora": ["61.00605","14.59591"], // 79250
				"Motala": ["58.55764","15.03327"], // 59129 (enligt eniro 59153)
				"Nacka": ["59.31176","18.17242"], // 13139
				"Solna": ["59.35836","17.97991"], // 17128 (enligt eniro 16931)
				"Stockholm": ["59.33724","18.00941"], // 10425 (enligt eniro 11251)
				"Sundsvall": ["62.44312","17.34847"], // 86333
				"Södertälje": ["59.18740","17.57918"], // 15159
				"Uppsala": ["59.84854","17.56013"], // 75267
				"Erikslund": ["59.61601", "16.46202"] // 72003 (enligt eniro 72138)   (Västerås. farligt med namnparsing)
				"Hälla, Västerås": ["59.60959","16.61908"], // 72134
				"Växjö": ["56.88333","14.76607"], // 35104
				"Ängelholm": ["56.25192","12.89028"] // 26271
				// TODO - resten! :P
			};
			var errors = [], ret,
				globaltime = getMatch("globaltime",$("div.store-info > ul.opening-hours > li").text(),/Alla dagar[ |\u00a0](.*)$/,errors),
				globalopen = getMatch("globalopen",globaltime,/(.*?)-/,errors)+":00",
				globalclose = getMatch("globalclose",globaltime,/-(.*)$/,errors)+":00",
				text = $("ul.curatogostaff>li>div>div").text();
			if (globalopen.length == 4){
				globalopen = "0"+globalopen;
			}
			if ((globalopen.length !== 5) || (globalclose.length !== 5)){
				errors.push("Strange times! "+globalopen+" "+globalclose);
			}
			// try to get name from headline in upper left
			var name = $("p.logo-suffix").text().replace(/Cura apoteket,?\w*/,"").replace(/^\s*/,"");
			// plan B if that failed
			if (!name){
				name = getMatch("name",$("div.textarea > div.text").text(),/apotekschef.*?Cura apoteket,?\w*(.*)$/,[]).replace(/^\s*/,"");
			}
			ensureOkString("name",name,errors);
			ret = {
				name: name,
				chain: "Cura",
				address: {
					street: getMatch("street",text,/Adress:?\s*(.*?)\d{3} \d{2}(.*?)E-post/,errors).replace(/,\s*$/g,""),
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
					latitude: ensureOkString("latitude",(coords[name] || ["",""])[0],errors),
					longitude: ensureOkString("longitude",(coords[name] || ["",""])[1],errors)
				}
			};
			ret.errors = errors;			
			console.log(ret);
		});
	});
});
