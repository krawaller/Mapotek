(function(){
	M.ui.createApplicationWindow = function(){
		var win = Ti.UI.createWindow(Object.combine($$.Window,{
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		}));
		var view = Ti.UI.createView();
		view.add(Ti.UI.createLabel(Object.combine($$.Label,{
			text: "Woooo!"
		})));
		win.add(view);
		return win;
	};
})();