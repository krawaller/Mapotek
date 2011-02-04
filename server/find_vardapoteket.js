var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
scraper('http://www.vardapoteket.se/hitta-ditt-apotek/', function(err, $) {
    if (err) {throw err}
	var base = "";
    $('h2 a').each(function() {
		var val = base + $(this).attr('href');
		db.save({ apotek: 'Vårdapoteket', href: val });
    });
});