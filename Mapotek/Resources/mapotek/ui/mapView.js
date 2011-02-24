(function(){
	M.ui.createMapView = function(){
		var view = K.create({k_type:"View"});
		view.add( K.create({k_type:"Label",text:"Map!"}) );
		return view;
	};
})();