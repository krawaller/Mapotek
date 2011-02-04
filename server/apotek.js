var crypto = require('crypto'),
	CouchClient = require('./couch-client'),
	_ = require('underscore'),
	db = CouchClient("http://kra.couchone.com/mapotek");

module.exports = {
	save: function(obj){
		obj._id = crypto.createHash('md5').update([obj.chain,obj.name].join("-")).digest("hex");
		console.log('saving', obj.name);
		db.save(obj);
	},
	byChain: function(chain, callback){
		db.view('/mapotek/_design/v1.0/_view/apotek', { key: chain }, function(err, doc){
			callback(_(doc.rows).pluck('value'));
		});
	}
};