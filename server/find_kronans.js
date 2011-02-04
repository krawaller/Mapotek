var scraper = require('./scraper'),
	request = require('request'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
request({ uri: 'http://www.kronansdroghandel.se/Valj-Apotek/' }, function(err, response, body) {
    if (err) {throw err}
	
    body.match(/http:\/\/www.kronansdroghandel.se\/Valj\-Apotek\/[^']+/g).forEach(function(m){
		db.save({ apotek: 'Kronans Droghandel', href: m });
	});
});