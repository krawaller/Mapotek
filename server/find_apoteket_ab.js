var request = require('request'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");

var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};

var i = 0, max = 3000;
function req(){
	var id = 'a'+pad(++i, 4)+'0001';
	console.log('trying i: ' + i + ' => ' + id);
	if(i < max){
		request({ uri: 'http://www.apoteket.se/privatpersoner/common/apotek.aspx?id=' + id}, function (err, response, body) {
			//console.log(body, response.statusCode);
			if(body.indexOf("oväntat fel") == -1){
				console.log('found ' + id);
				db.save({ apotek: 'Apoteket AB', href: 'http://www.apoteket.se/privatpersoner/common/apotek.aspx?id=' + id, aid: id });
			}
			setTimeout(req, 500);
		});
	}
}
req();