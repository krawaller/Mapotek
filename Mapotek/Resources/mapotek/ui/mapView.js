(function(){
	M.ui.createMapView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Map",
			MapotekViewTitle: "Karta"
		});
		view.add( K.create({k_type:"Label",text:"Map!"}) );
		return view;
	};
})();