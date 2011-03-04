(function(){
	M.ui.createApplicationWindow = function(){
		var win = K.create({
			k_type: "Window",
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		}),
		maptab = M.ui.createMapView(),
		hometab = M.ui.createHomeTab(),
		pharmacytab = M.ui.createListZoomView({
			MapotekViewId: "PharmacyTab",
			list: M.ui.createPharmacyListView(),
			zoom: M.ui.createPharmacyView(),
			width: $$.platformWidth // for some reason this gets doubled?!
		}),
		companytab = M.ui.createListZoomView({
			MapotekViewId: "CompanyTab",
			list: M.ui.createCompanyListView(),
			zoom: M.ui.createCompanyView(),
			backLabel: "all"
		}),
		reportview = M.ui.createReportView(),
		tabs = ["home","map","pharmacies","companies"],
		filmstrip = M.ui.createFilmStripView({
			MapotekViewId: "mainfilmstrip",
			views: [hometab,maptab,pharmacytab,companytab]
		}),
		reportbtn = K.create({
			k_class: "NavButtonView",
			width: 30,
			bottom: 10,
			right: -40, // animated to 10
			k_children: [{
				k_class: "NavButtonLabel",
				text: "!!!"
			}],
			k_click: function(e){
				Ti.App.fireEvent("app:report",M.app.current);
			}
		});
		win.add(filmstrip);
		var tabbtns = [];
		tabs.forEach(function(label,i){
			var btn = K.create({
				k_class: "NavButtonView",
				width: 50,
				bottom: -50, // animated to 10
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
			filmstrip.addEventListener("leftTab",function(e){
				if (e.source.MapotekViewId === "mainfilmstrip" && e.idx === i){
					var lbl = btn.k_children[0];
					lbl.text = lbl.text.toLowerCase();
					lbl.font = {
						fontWeight: "normal"
					};
				}
			});
			filmstrip.addEventListener("arriveAtTab",function(e){
				if (e.source.MapotekViewId === "mainfilmstrip" && e.idx === i){
					var lbl = btn.k_children[0];
					lbl.text = lbl.text.toUpperCase();
					lbl.font = {
						fontWeight: "bold"
					};
				}
			});
			tabbtns.push(btn);
			win.add(btn);
		});
		var titleview = K.create({
			k_type: "View",
			height: 30,
			top: 10,
			width: 200,
			left: 10,
			borderWidth: 1,
			borderColor: "#000",
			k_children: [{
				k_class: "TitleLabel"
			}]
		}), titlelabel = titleview.k_children[0];
		win.add(titleview);
		Ti.App.addEventListener("app:settitle",function(e){
			titleview.animate({transform:Ti.UI.create2DMatrix().scale(1,0.1)},function(){
				titlelabel.text = e.title;
				titleview.animate({transform:Ti.UI.create2DMatrix().scale(1,1)});
			});
		});
		
		win.add(reportview);
		win.add(reportbtn);
		function animateControls(){
			tabbtns.forEach(function(e,i){
				e.bottom = -40;
				setTimeout(function(){
					e.animate({bottom:10,duration:400,curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT});
				},500+i*100);
			});			
			setTimeout(function(){
				reportbtn.right = -80;
				reportbtn.animate({right:10,duration:400,curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT});
			},1200);
		}
		Ti.App.addEventListener("app:start",function(e){
			Ti.API.log("Caught start event in filmstrip!");
			filmstrip.fireEvent("changeIndex",{idx:0,force:true});
			animateControls();
		});
		Ti.App.addEventListener("focus",function(e){
			alert("FOCUS!!");
			animateControls();
		});
		Ti.App.addEventListener("showChain",function(e){
			Ti.API.log("Catching companyshow event!");
			filmstrip.fireEvent("changeIndex",{idx:3,zoom:{chain:e.chain}});
		});
		Ti.App.addEventListener("showPharmacy",function(e){
			Ti.API.log("Catching pharmacyshow event!");
			filmstrip.fireEvent("changeIndex",{idx:2,zoom:{pharmacy:e.pharmacy}});
		});
		Ti.App.addEventListener("showMap",function(e){
			filmstrip.fireEvent("changeIndex",{idx:1,pharmacy:e.pharmacy});
		});
		return win;
	};
})();