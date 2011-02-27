(function(){
	M.ui.createAboutView = function(){
		var view = M.ui.createView({
			MapotekViewId: "About",
			MapotekViewTitle: "Start"
		});
		view.add( K.create({k_type:"Label",text:"About!"}) );
		return view;
	};
})();