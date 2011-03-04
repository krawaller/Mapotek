(function(){
	M.ui.createMapView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Map",
			MapotekViewTitle: "Karta",
			k_children: [{
				text: "Map!"
			},{
				width: 80,
				top: 260,
				opacity: 0,
				k_id: "fakePin",
				k_class:"NavButtonView",
				k_children: [{
					k_class:"NavButtonLabel"
				}],
				k_click: function(e){
					Ti.App.fireEvent("showPharmacy",{pharmacy:pharmacy});
				}
			}]
		}), pharmacy;
		view.render = function(e){
			if (e.pharmacy){
				pharmacy = e.pharmacy;
				view.k_children.fakePin.opacity = 1;
				view.k_children[0].text = "Map! " + (e.coords? "Showing "+pharmacy.coords.latitude+"/"+pharmacy.coords.longitude : "");
				view.k_children.fakePin.k_children[0].text = pharmacy.name;
			}
		};
		return view;
	};
})();