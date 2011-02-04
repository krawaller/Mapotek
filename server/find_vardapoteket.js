var scraper = require('./scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(9);
	
scraper('http://www.vardapoteket.se/hitta-ditt-apotek/', function(err, $) {
    if (err) {throw err}
	var base = "";
    $('h2 a').each(function() {
		var val = base + $(this).attr('href');
        //console.log(val);
		client.set(val, 1);
    });
});