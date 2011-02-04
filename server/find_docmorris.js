var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
scraper('http://www.docmorris.se/Hitta-apotek/', function(err, $) {
    if (err) {throw err}
	var base = "http://www.docmorris.se";
    $('.articlelist a').each(function() {
		var val = base + $(this).attr('href');
        //console.log(val);
		db.save({ apotek: 'DocMorris', href: val });
    });
});