var scraper = require('./scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(6);
	
scraper('http://www.ica.se/curaapoteket', function(err, $) {
    if (err) {throw err}
	var base = "http://www.ica.se";
    $('.contentarea td a').each(function() {
        client.set(base + $(this).attr('href'), 1);
    });
});