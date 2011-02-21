(function(){
	M.ui.createApplicationWindow = function(){
		var win = Ti.UI.createWindow(Object.combine($$.Window,{
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		}));
		win.add(M.ui.createAboutView());
		return win;
	};
})();