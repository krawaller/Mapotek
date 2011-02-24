(function(){
	M.ui.createCompanyView = function(){
		var view = K.create({k_type:"View"});
		view.add( K.create({k_type:"Label",text:"Company!"}) );
		return view;
	};
})();