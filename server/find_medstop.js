var scraper = require('./scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(5);
	
scraper('http://www.medstop.se/hitta-apotek', function(err, $) {
    if (err) {throw err}

    $('.item-list .item-list a').each(function() {
        client.set('http://www.medstop.se' + $(this).attr('href'), 1);
    });
});