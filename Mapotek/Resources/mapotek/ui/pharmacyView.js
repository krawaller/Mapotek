(function(){
	M.ui.createPharmacyView = function(){
		var view = K.create({k_type:"View"});
		view.add( K.create({k_type:"Label",text:"Pharmacy!"}) );
		return view;
	};
})();