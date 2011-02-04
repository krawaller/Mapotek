var scraper = require('./scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(7);
	
scraper('http://www.docmorris.se/Hitta-apotek/', function(err, $) {
    if (err) {throw err}
	var base = "http://www.docmorris.se";
    $('.articlelist a').each(function() {
		var val = base + $(this).attr('href');
        //console.log(val);
		client.set(val, 1);
    });
});