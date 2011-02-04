var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek"),
	fs = require('fs');

db.view('/mapotek/_design/v1.0/_view/apotek', { key: "Apotek Hjärtat" }, function(err, doc){
	doc.rows.forEach(function(row, i){
		if(i != 0){ return; } // just one for now
		var obj = row.value,
			url =  'http://localhost/apps/mapotek/server/tmp/parse_apotek_hjartat.html'; // should be obj.href
		
		scraper(url, function(err, $) {
		    if (err) {throw err}
		
			var address = $('.vcard .adr:eq(0) .street-address').text();
			console.log(address);
		});
	});
});
