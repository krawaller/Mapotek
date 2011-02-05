{
   "_id": "_design/v1.0",
   "views": {
       "apotek": {
           "map": "function(doc){ if(doc.apotek){ emit(doc.apotek, doc); } }"
       },
       "status": {
	       "map": "function(doc){ if(doc.chain){ emit(doc.chain, doc); } }",
	       "reduce": "function(keys,values){ var ret= {}; values.forEach(function(a){ if (!ret[a.chain]){ ret[a.chain] = { number: 0, witherrors: 0};} ret[a.chain].number++; if(a.errors && a.errors.length){ret[a.chain].witherrors++;} }); return ret; }"
       }
   }
}


function(keys,values){
	var ret = {};
	values.forEach(function(a){
		if (!ret[a.chain]){
			ret[a.chain] = {
				number: 0,
				witherrors: 0
			};
		}
		ret[a.chain].number++;
		if(a.errors && a.errors.length){
			ret[a.chain].witherrors++;
		}
	});
	return ret;
}