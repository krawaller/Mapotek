var request = require('request'),
	redis = require("redis-node");
	
var client = redis.createClient();    // Create the client
	client.select(3);

var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};

var i = 867, max = 9999;
function req(){
	var id = 'a'+pad(++i, 4)+'0001';
	console.log('trying i: ' + i + ' => ' + id);
	if(i < max){
		request({ uri: 'http://www.apoteket.se/privatpersoner/common/apotek.aspx?id=' + id}, function (err, response, body) {
			if(body){
				console.log('found ' + id);
				client.set(id, 1);
			}
			setTimeout(req, 1000);
		});
	}
}
req();