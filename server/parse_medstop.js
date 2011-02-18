/*
Medstop FFS! 
Ingen info i the DOM, ty den skrivs ut med JavaScript. WTF?!?! Helt sjukt.
Måste därför hitta rätt skript-tag och parsa ut informationen. 
Medstop verkar aldrig ha lunchrast, så inget stöd för det. Dock inte alltid alla dagar i öppettidslista, så måste ha tomma arrays som default.
Saknar postnummer.
*/

/*
Observera att varje seed-sida är per STAD, och kan innehålla flera apotek. Funktionen returnerar därför en array med alla apotek.

*/

var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', {
	key: "Medstop"
},
function(err, doc) {
	function getMatch(what, source, regexp, errors) {
		var match = source.match(regexp);
		if (match && match.length > 0) {
			return match[match.length > 1 ? 1 : 0];
		}
		errors.push("Couldn't find " + what + " in " + source);
		return "";
	}


	function ensureOkString(what, str, errors, longisok) {
		if (!str) {
			errors.push("Couldn't find " + what + "!");
		}
		if (!longisok && str.length > 30) {
			errors.push(what + " is suspiciously long!");
		}
		return str || "";
	}
	doc.rows.forEach(function(row, i) {
		if (i != 0) {
			return;
		} // just one for now
		var obj = row.value,
			url = 'http://localhost/mapotek/server/tmp/parse_medstop.html'; // should be obj.href
		scraper(url, function(err, $, opts, raw) {
			if (err) {
				throw err;
			}
			var raws = raw.match(/markers\.pus([\s\S]*?)'\}\);/g),
				rets = [];
			raws.map(function(raw) {
				var errors = [],
					ret, coords = raw.match(/\d\d\.\d{1,}/g),
					html = $(getMatch("html code", raw, /text: '(.*?)'/, errors)),
					match;
				ret = {
					chain: "Medstop",
					name: getMatch("name", raw, /<b>Medstop apotek (.*?)</, errors),
					address: {
						street: getMatch("street", raw, /^.*?<br \/>(.*?)</, errors),
						city: getMatch("city", raw, /<br \/>.*?<br \/>(.*?)</, errors)
					},
					coords: {
						latitude: ensureOkString("latitude", coords[0], errors),
						longitude: ensureOkString("longitude", coords[1], errors)
					},
					hours: {
						monday: [],
						tuesday: [],
						wednesday: [],
						thursday: [],
						friday: [],
						saturday: [],
						sunday: []
					},
					phone: getMatch("phone", raw, /<a href=\"callto.*?>(.*?)</, errors).replace(/\D/g, ""),
					mail: getMatch("mail", raw, /mailto:(.*?)"/, errors)
				};
				html.find(".oh-display").each(function(i, el) {
					var matcher = {
						"måndag": "monday",
						"tisdag": "tuesday",
						"onsdag": "wednesday",
						"torsdag": "thursday",
						"fredag": "friday",
						"lördag": "saturday",
						"söndag": "sunday"
					},
						text = $(el).text(),
						day = matcher[getMatch("weekday", text, /^(.*?) /, errors)],
						time = getMatch("weekday opening hour", text, /\d?\d:\d\d - \d?\d:\d\d/, errors);
					if (day) {
						var span = time.match(/\d?\d:\d\d/g);
						if (span && span.length == 2) {
							ret.hours[day].push(span);
						} else {
							errors.push("Error when parsing opening times for " + day + ": " + time);
						}
					} else {
						errors.push("Unknown day " + day);
					}
				});
				if (ret.hours.monday.length + ret.hours.tuesday.length + ret.hours.wednesday.length + ret.hours.thursday.length + ret.hours.friday.length + ret.hours.saturday.length + ret.hours.sunday.length < 1) {
					errors.push("No opening hours?!");
				}
				ret.errors = errors;
				rets.push(ret);
			});
			console.log(rets);
		});
	});
});
/************ CONTENT OF HTML ******************
 <b>Medstop apotek Svanen</b>
 <br />
 St Torggatan 7
 <br />Skurup
 <br />
 <br />
 <b>Öppettider</b>
 <br />
 <span style="text-transform:capitalize;">
 <div class="oh-display">måndag <span class="oh-display-hours">09:30 - 18:00</span></div>
 <div class="oh-display">tisdag <span class="oh-display-hours">09:30 - 18:00</span></div>
 <div class="oh-display">onsdag <span class="oh-display-hours">09:30 - 18:00</span></div>
 <div class="oh-display">torsdag <span class="oh-display-hours">09:30 - 18:00</span></div>
 <div class="oh-display">fredag <span class="oh-display-hours">09:30 - 18:00</span></div>
 <div class="oh-display">lördag <span class="oh-display-hours">09:30 - 13:00</span></div>
 <br />
 </span>
 <b>Kontaktuppgifter</b>
 <br />
 Telefon: 
 <a href="callto:+46077444 11 11">077-444 11 11</a>
 <br />
 E-post:
 <a href="mailto:apoteket.svanen.skurup@medstop.se">apoteket.svanen.skurup@medstop.se</a>
 */
