(function(){
	M.ui.createDatastateView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Datastate",
			MapotekViewTitle: "Datastatus"
		});
		view.add( K.create({k_type:"Label",text:"Datastate!"}) );
		return view;
	};
})();