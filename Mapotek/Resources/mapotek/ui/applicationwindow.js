(function(){
	M.ui.createApplicationWindow = function(){
		var win = K.create({
			k_type: "Window",
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		});
		win.add(M.ui.createAboutView());
		return win;
	};
})();