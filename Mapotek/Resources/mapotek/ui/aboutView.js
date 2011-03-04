(function(){
	M.ui.createAboutView = function(){
		var view = M.ui.createView({
			MapotekViewId: "About",
			MapotekViewTitle: "Start"
		});
		view.add( K.create({k_type:"Label",text:"Homescreen with text about the app and some instructions detailing the nav!"}) );
		return view;
	};
})();