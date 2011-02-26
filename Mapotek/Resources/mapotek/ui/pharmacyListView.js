(function(){
	M.ui.createPharmacyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "PharmacyList",
		});
		view.add( K.create({k_type:"Label",text:"PharmacyList!"}) );
		return view;
	};
})();