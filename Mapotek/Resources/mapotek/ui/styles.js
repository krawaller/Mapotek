(function() {	
	 var theme = {
		textColor:'#000000',
		grayTextColor:'#888888',
		headerColor:'#333333',
		lightBlue:'#006cb1',
		darkBlue:'#93caed',
		fontFamily: M.os({
			iphone:'Helvetica Neue',
			android:'Droid Sans'
		})
	};
	M.ui.theme = theme;

	M.ui.properties = {
		//grab platform dimensions only once to save a trip over the bridge
		platformWidth: Ti.Platform.displayCaps.platformWidth,
		platformHeight: Ti.Platform.displayCaps.platformHeight,
		animationDuration: 300,
		//we use these for default components
		Window: {
			
		},
		Button: {
			height:50,
			width:250,
			color:'#000',
			font: {
				fontSize:18,
				fontWeight:'bold'
			}
		},
		Label: {
			color:theme.textColor,
			font: {
				fontFamily:theme.fontFamily,
				fontSize:15
			},
			textAlign: "center",
			height:'auto'
		},
		TextField: {
			height:55,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			color:'#000000',
			clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS
		},
		headerView: {
			backgroundColor:'#CCC',
			height:40
		}
	};
})();

//global shortcut for UI properties, since these get used A LOT. polluting the global
//namespace, but for a good cause (saving keystrokes)
var $$ = M.ui.properties;
