(function(){
	M.ui.createPharmacyView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Pharmacy"
		});
		view.add( K.create({k_type:"Label",text:"Pharmacy!"}) );
		return view;
	};
})();