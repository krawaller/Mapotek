(function(){
	M.ui.createAboutView = function(){
		var view = K.create({k_type:"View"});
		view.add( K.create({k_type:"Label",text:"About!"}) );
		return view;
	};
})();