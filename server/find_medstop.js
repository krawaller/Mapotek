var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
scraper('http://www.medstop.se/hitta-apotek', function(err, $) {
    if (err) {throw err}

    $('.item-list .item-list a').each(function() {
		db.save({ apotek: 'Medstop', href: 'http://www.medstop.se' + $(this).attr('href') });
    });
});