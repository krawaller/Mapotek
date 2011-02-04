var request = require('request'),
	scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
scraper('http://www.ica.se/curaapoteket', function(err, $) {
    if (err) {throw err}
	var base = "http://www.ica.se";
    $('.contentarea td a').each(function() {
		db.save({ apotek: 'Cura', href: base + $(this).attr('href') });
    });
});