var request = require('request'),
	scraper = require('./scraper'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(3, init);

function init(err){
	/*client.keys("a*", function(err, keys){
		keys.forEach(function(key){
			console.log(key);
		});
	});*/
}


scraper('http://localhost/apps/mapotek/server/tmp/parse_apoteket.html', function(err, $) {
    if (err) {throw err}
	var res = $('.hitta_001');
	
	res.eq(0).find('tr').each(function(){
		var tds = $(this).find('td');
		var daystr = tds.eq(0).text().trim();
		var m = daystr.match(/([\w]+)\s*(\d+)\s*(\w+)/)
		console.log(m);
	})
	
	//console.log(res);
	var phone = res.eq(1).find('td:eq(1)').text();
});


