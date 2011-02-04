// one fat page with all info
// http://www.apoteksgruppen.se/sidor/lista.aspx

var request = require('request'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
db.save({ apotek: 'Apoteksgruppen', href: 'http://www.apoteksgruppen.se/sidor/lista.aspx' });
	