(function(){
	M.ui.createApplicationWindow = function(){
		var win = K.create({
			k_type: "Window",
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		}),
		mapview = M.ui.createMapView(),
		aboutview = M.ui.createAboutView(),
		pharmacyview = M.ui.createPharmacyView(),
		companyview = M.ui.createCompanyView(),
		reportview = M.ui.createReportView(),
		tabs = ["about","map","pharmacies","companies"],
		filmstrip = M.ui.createFilmStripView({
			views: [aboutview,mapview,pharmacyview,companyview],
			leave: function(e){Ti.App.fireEvent("app:leftTab",{idx:e.from});},
			arrive: function(e){Ti.App.fireEvent("app:arrivedAtTab",{idx:e.to});M.app.currentTab = tabs[e.to];}
		}),
		reportbtn = K.create({
			k_type: "View",
			height: 30,
			width: 30,
			top: 10,
			right: 10,
			borderColor: "#000",
			borderWidth: 1,
			backgroundColor: "#CCC",
			k_children: [{
				text: "!!!"
			}],
			k_click: function(e){
				Ti.API.log("FAKKINELL");
				Ti.App.fireEvent("app:report",{about:M.app.currentTab});
			}
		});
		win.add(filmstrip);
		tabs.forEach(function(label,i){
			var btn = K.create({
				k_type:"View",
				height: 30,
				width: 50,
				bottom: 10,
				left: 10 + i*60,
				backgroundColor: "#CCC",
				borderColor: "#000",
				borderWidth: 1,
				k_children: [{
					text: label.substr(0,3)
				}],
				k_click: function(e){
					filmstrip.fireEvent('changeIndex',{idx:i});
					Ti.API.log("Clicked "+label);
				}
			});
			Ti.App.addEventListener("app:leftTab",function(e){
				if (e.idx === i){
					btn.k_children[0].text = btn.k_children[0].text.toLowerCase();
				}
			});
			Ti.App.addEventListener("app:arrivedAtTab",function(e){
				if (e.idx === i){
					btn.k_children[0].text = btn.k_children[0].text.toUpperCase();
				}
			});
			win.add(btn);
		});
		win.add(reportview);
		win.add(reportbtn);
		return win;
	};
})();