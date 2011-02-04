var scraper = require('./scraper'),
	request = require('request'),
	redis = require("redis-node");

	var client = redis.createClient();    // Create the client
		client.select(8);
	
request({ uri: 'http://www.kronansdroghandel.se/Valj-Apotek/' }, function(err, response, body) {
    if (err) {throw err}
	
    body.match(/http:\/\/www.kronansdroghandel.se\/Valj\-Apotek\/[^']+/g).forEach(function(m){
		client.set(m, 1);
	});
});