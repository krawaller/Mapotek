(function(){
	M.ui.createAboutView = function(){
		var view = M.ui.createView({
			MapotekViewId: "About"
		});
		view.add( K.create({k_type:"Label",text:"About!"}) );
		return view;
	};
})();