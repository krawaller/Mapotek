(function(){
	M.ui.createMapView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Map",
			MapotekViewTitle: "Karta",
			k_children: [{
				text: "Map!"
			}]
		});
		view.render = function(e){
			view.k_children[0].text = "Map! " + (e.coords? "Showing "+e.coords.latitude+"/"+e.coords.longitude : "");
		};
		return view;
	};
})();