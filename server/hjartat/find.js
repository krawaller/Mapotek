var scraper = require('../scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(4);
	
var i = 0, max = 1;	
function scrape(){
	if(++i <= max){
		scraper('http://www.apotekhjartat.se/hitta-apotek-hjartat/?epslanguage=sv&q=*&resid=1350490027&id=21&defbn='+i+'&uaid=036E52D96484D848BC54C965AD9DC826:38332E3233332E3132382E313338:5245991571575188957', function(err, $) {
		    if (err) {throw err}

			console.log($('body').html());
		});
	}
}