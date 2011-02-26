(function() {
	M.ui = {};
	M.ui.createView = function(o){
		if (!o.MapotekViewId){
			throw "No MapotekViewId!";
		}
		var view = K.create(K.merge({k_type:"View"},o));
		view.addEventListener("show",function(e){
			var reportData = "";
			Ti.API.log("SHOW event caught in "+e.source.MapotekViewId+". Was it me?");
			Ti.API.log([e.source,view,e.source === view,view.MapotekViewId === e.source.MapotekViewId]);
			if (e.source.MapotekViewId === view.MapotekViewId){
				Ti.API.log("--- Was me!!! "+e.source.MapotekViewId);
				if (K.isFunc(e.source.render)){
					Ti.API.log("--- I have a render function! Calling!");
					reportData = e.source.render(e);
				};
				if (!e.source.MapotekCompositeView){
					Ti.API.log("--- Updating report data!");
					M.app.current = {
						view: e.source.MapotekViewId,
						what: reportData
					};
				}
			}
		});
		return view;
	};
	M.ui.createListZoomView = function(_args) {
		function showZoom(anim,args){
			zooming = true;
			Ti.API.log("ZOOOOOOOOOOOM");
			zoom.fireEvent("show",args);
			if (anim){
				list.animate({opacity: 0});
				zoom.animate({opacity: 1});
			}
			else {
				list.opacity = 0;
				zoom.opacity = 1;
			}
		}
		function showList(anim){
			zooming = false;
			list.fireEvent("show");
			if (anim){
				list.animate({opacity: 1});
				zoom.animate({opacity: 0});
			}
			else {
				list.opacity = 1;
				zoom.opacity = 0;
			}
		}
		if (!_args.MapotekViewId){
			throw "No MapotekViewId!";
		}
		var root = K.create({
			k_type: "View"
		}),
		zooming = false,
		zoom = _args.zoom,
		list = _args.list;
		zoom.opacity = 0;
		zoom.add(K.create({
			k_type: "View",
			top: 10,
			left: 10,
			height: 30,
			width: 60,
			borderColor: "#000",
			borderWidth: 1,
			k_children: [{
				text: "<---"
			}],
			k_click: function(){
				//list.fireEvent("show");
				Ti.API.log("Clicked back to list");
				showList(true);
			}
		}));
		root.add(zoom);
		root.add(list);
		root.addEventListener("show",function(e){
			Ti.API.log(["ListZoom show event caught. Is it me?",e.source.MapotekViewId,root.MapotekViewId]);
			if (e.source.MapotekViewId === root.MapotekViewId){
				Ti.API.log("--- Showing a ListZoom view!");
				if (e.zoom){
					showZoom(false,e.zoom);
				}
				else {
					showList(false);
				}
			}
		});
		list.addEventListener("zoom",function(e){
			Ti.API.log("zoom event caught");
			showZoom(true,e);
		});
		return root;
	};
	M.ui.createFilmStripView = function(_args) {
		var root = K.create({
			k_type: "View"
		}),
		views = _args.views,
		index = 0,
		previndex = 0,
		container = K.create({
			k_type: "View",
			top: 0,
			left: 0,
			bottom: 0,
			width: $$.platformWidth * _args.views.length
		});

		for (var i = 0, l = views.length; i < l; i++) {
			var newView = K.create({
				k_type: "View",
				top: 0,
				bottom: 0,
				left: $$.platformWidth * i,
				width: $$.platformWidth
			});
			newView.add(views[i]);
			container.add(newView);
		}
		root.add(container);

		//set the currently visible index
		root.addEventListener('changeIndex', function(e) {
			if (index != e.idx || e.force) {
				previndex = index;
				index = e.idx;
				if (_args.leave) {
					_args.leave({
						from: previndex,
						to: index
					});
				}
				Ti.API.log("Tabclick, navigating to "+index);
				views[index].fireEvent("show",{viewtarget:views[index].MapotekViewId});
				container.animate({
					duration: $$.animationDuration,
					left: $$.platformWidth * e.idx * -1
				},
				function() {
					Ti.API.log("Arrived at new tab");
					if (_args.arrive) {
						_args.arrive({
							from: previndex,
							to: index
						});
					}
				});
			}
		});

		return root;
	};
})();

Ti.include("/mapotek/ui/styles.js");

Ti.include("/mapotek/ui/applicationWindow.js");

Ti.include("/mapotek/ui/aboutView.js");
Ti.include("/mapotek/ui/companyListView.js");
Ti.include("/mapotek/ui/companyView.js");
Ti.include("/mapotek/ui/datastateView.js");
Ti.include("/mapotek/ui/mapView.js");
Ti.include("/mapotek/ui/pharmacyListView.js");
Ti.include("/mapotek/ui/pharmacyView.js");
Ti.include("/mapotek/ui/reportView.js");
