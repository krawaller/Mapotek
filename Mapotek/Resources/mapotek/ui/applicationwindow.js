(function(){
	M.ui.createApplicationWindow = function(){
		var win = K.create({
			k_type: "Window",
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		}),
		maptab = M.ui.createMapView(),
		abouttab = M.ui.createAboutView(),
		pharmacytab = M.ui.createListZoomView({
			MapotekViewId: "PharmacyTab",
			list: M.ui.createPharmacyListView(),
			zoom: M.ui.createPharmacyView()
		}),
		companytab = M.ui.createListZoomView({
			MapotekViewId: "CompanyTab",
			list: M.ui.createCompanyListView(),
			zoom: M.ui.createCompanyView(),
			backLabel: "all"
		}),
		reportview = M.ui.createReportView(),
		tabs = ["about","map","pharmacies","companies"],
		filmstrip = M.ui.createFilmStripView({
			views: [abouttab,maptab,pharmacytab,companytab],
			leave: function(e){Ti.App.fireEvent("app:leftTab",{idx:e.from});},
			arrive: function(e){Ti.App.fireEvent("app:arrivedAtTab",{idx:e.to});M.app.currentTab = tabs[e.to];}
		}),
		reportbtn = K.create({
			k_class: "NavButtonView",
			width: 30,
			bottom: 10,
			right: -40,
			k_children: [{
				k_class: "NavButtonLabel",
				text: "!!!"
			}],
			k_click: function(e){
				Ti.App.fireEvent("app:report",M.app.current);
			}
		});
		win.add(filmstrip);
		var tabbar = K.create({
			k_type: "View",
			height: 40,
			bottom: -40
		});
		tabs.forEach(function(label,i){
			var btn = K.create({
				k_class: "NavButtonView",
				width: 50,
				bottom: 10,
				left: 10 + i*60,
				k_children: [{
					k_class: "NavButtonLabel",
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
			tabbar.add(btn);
		});
		win.add(tabbar);
		win.add(reportview);
		win.add(reportbtn);
		Ti.App.addEventListener("app:start",function(e){
			Ti.API.log("Caught start event in filmstrip!");
			filmstrip.fireEvent("changeIndex",{idx:0,force:true});
			setTimeout(function(){
				tabbar.animate({bottom:0,duration:400});
			},500);
			setTimeout(function(){
				reportbtn.animate({right:10,duration:400});
			},1000);
		});
		Ti.App.addEventListener("showCompany",function(e){
			Ti.API.log("Catching companyshow event!");
			filmstrip.fireEvent("changeIndex",{idx:3,zoom:{company:e.company}});
		});
		return win;
	};
})();