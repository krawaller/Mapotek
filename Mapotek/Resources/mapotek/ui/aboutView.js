(function(){
	M.ui.createAboutView = function(){
		var view = Ti.UI.createView(Object.combine($$.View,{}));
		view.add(Ti.UI.createLabel(Object.combine($$.Label,{text:"About!"})));
		return view;
	};
})();