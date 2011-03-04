(function() {
	M.ui = {};
	M.ui.createView = function(o){
		if (!o.MapotekViewId){
			throw "No MapotekViewId!";
		}
		var view = K.create(K.merge(o,{
			k_type:"View",
			width: $$.platformWidth
		})),
		showing = false;
		view.addEventListener("show",function(e){
			var renderResult = "";
			if (e.source.MapotekViewId === view.MapotekViewId){
				showing = true;
				Ti.API.log("SHOW event caught in "+view.MapotekViewId);
				if (K.isFunc(e.source.render)){
					Ti.API.log("--- I have a render function! Calling!");
					renderResult = e.source.render(e) || {};
				};
				if (!e.source.MapotekCompositeView){
					Ti.API.log("--- Updating report data!");
					M.app.current = {
						view: e.source.MapotekViewId,
						what: renderResult.reportData
					};
					Ti.App.fireEvent("app:settitle",{title:renderResult.title || o.MapotekViewTitle});
				}
			}
			else {
				if (showing){
					Ti.API.log("--- leaving "+view.MapotekViewId);
					showing = false;
					if (view.leave){
						Ti.API.log("--- Calling leave in "+view.MapotekViewId+"");
						view.leave(e);
					}
				}
			}
		});
		return view;
	};
	M.ui.createListZoomView = function(_args) {
		function showZoom(anim,args){
			zooming = true;
			Ti.API.log("--- firing show event in zoom view "+zoom.MapotekViewId);
			zoom.fireEvent("show",args);
			if (anim){
				list.animate({opacity: 0});
				zoom.animate({opacity: 1});
			}
			else {
				list.opacity = 0;
				zoom.opacity = 1;
			}
			setTimeout(function(){
				listbtn.opacity = 1;
				listbtn.animate({
					top: 10
				});
			},500);
		}
		function showList(anim){
			zooming = false;
			Ti.API.log("--- firing show event in List view "+list.MapotekViewId);
			list.fireEvent("show");
			if (anim){
				list.animate({opacity: 1});
				zoom.animate({opacity: 0});
			}
			else {
				list.opacity = 1;
				zoom.opacity = 0;
			}
			listbtn.animate({
				top: -70
			},function(){
				listbtn.opacity = 0;
			});
		}
		if (!_args.MapotekViewId){
			throw "No MapotekViewId!";
		}
		var root = K.create(K.merge({
			k_type: "View"
		},_args)),
		zooming = false,
		zoom = _args.zoom,
		list = _args.list;
		zoom.opacity = 0;
		var listbtn = K.create({
			k_class: "NavButtonView",
			top: 10,
			right: 10,
			height: 30,
			width: 60,
			borderColor: "#000",
			borderWidth: 1,
			opacity: 0,
			k_children: [{
				label: "NavButtonLabel",
				text: _args.backLabel || "<---"
			}],
			k_click: function(){
				//list.fireEvent("show");
				Ti.API.log("Clicked back to list");
				showList(true);
			}
		});
		root.add(zoom);
		root.add(list);
		root.add(listbtn);
		root.addEventListener("show",function(e){
			if (e.source.MapotekViewId === root.MapotekViewId){
				Ti.API.log("SHOW event caught in ListZoom view "+root.MapotekViewId+" (width="+e.source.width+", left="+e.source.left+")");
				if (e.zoom){
					showZoom(false,e.zoom);
				}
				else {
					showList(false);
				}
			}
		});
		list.addEventListener("zoom",function(e){
			Ti.API.log("ZOOM event caught in "+root.MapotekViewId);
			showZoom(true,e);
		});
		return root;
	};
	M.ui.createCompositeView = function(_args) {
		if (!_args.MapotekViewId){
			throw "No MapotekViewId!";
		}
		var root = M.ui.createView(K.merge({
			width: $$.platformWidth
		},_args)),
		container = K.create(K.merge({
			left: 0,
			top: 0,
			k_type: "View"
		},_args)),
		views = _args.views,
		index = 0,
		previndex = 0;
		views.forEach(function(view,i){
			/*var newView = M.ui.createView({
				MapotekViewId: "Composite---"+_args.MapotekViewId+"---"+i,
				top: 0,
				bottom: 0,
				left:0, // $$.platformWidth * i,
				width: $$.platformWidth
			});
			newView.add(view);
			newView.addEventListener("show",function(e){
				if (e.source.MapotekViewId === newView.MapotekViewId){
					view.fireEvent("show",e);
				}
			});
			container.add(newView); */
			container.add(views[i]);
			//root.add(views[i]);
			/*if (view.setMapotekViewParent){
				Ti.API.log(["MOOO",view.setMapotekViewParent,typeof view.setMapotekViewParent,K.isFunc(view.setMapotekViewParent)]);
				view.setMapotekViewParent(root,i);
			}*/
		});
		root.add(container);

		//set the currently visible index
		root.addEventListener('changeIndex', function(e) {
			if ((e.source.MapotekViewId === root.MapotekViewId) && (index != e.idx || e.force)) {
				previndex = index;
				index = e.idx;
				Ti.API.log(["Changing index in "+root.MapotekViewId+" to "+index+", firing show event in view "+views[index].MapotekViewId,views[index].def]);
				views[index].fireEvent("show",K.merge({viewtarget:views[index].MapotekViewId},e));
				_args.changeIndex(container,views,index,previndex);
			}
		});
		
		root.addEventListener('show',function(e){
			if (e.source.MapotekViewId === root.MapotekViewId){
				Ti.API.log("SHOW caught in composite "+root.MapotekViewId+" with left "+root.left+"! Firing show event in subview "+index+" ("+views[index||0].MapotekViewId+")");
				views[index || 0].fireEvent("show",K.merge({viewtarget:views[index||0].MapotekViewId},e));
			}
		});
		root.views = views;
		return root;
	};
	M.ui.createFilmStripView = function(o){
		var changeIndex = function(container,views,index,previndex){
			Ti.API.log("---FilmStrip "+o.MapotekViewId+" changeindex callback, firing lefttab event");
			filmstrip.fireEvent("leftTab",{idx:previndex});
			container.animate({
				duration: $$.animationDuration,
				left: $$.platformWidth * index * -1
			},
			function() {
				filmstrip.fireEvent("arriveAtTab",{idx:index});
			});
		},
		filmstrip = M.ui.createCompositeView(K.merge({changeIndex:changeIndex,width:$$.platformWidth*o.views.length},o));
		filmstrip.views.forEach(function(view,i){
			view.left = $$.platformWidth * i;
		});
		return filmstrip;
	};
	M.ui.createFlipView = function(o){
		var changeIndex = function(container,views,index,previndex){
			Ti.API.log("---FlipView "+o.MapotekViewId+" changeindex callback, firing lefttab event");
			flipview.fireEvent("leftTab",{idx:previndex});
			container.animate({
				duration: $$.animationDuration,
				transform: Ti.UI.create2DMatrix().scale(0.1,1)
			},function(){
				flipview.fireEvent("arriveAtTab",{idx:index});
				views.forEach(function(view,i){
					view.opacity = (i===index ? 1 : 0);
				});
				container.animate({
					duration: $$.animationDuration,
					transform: Ti.UI.create2DMatrix()
				});
			});
		},
		flipview = M.ui.createCompositeView(K.merge({changeIndex:changeIndex,width:$$.platformWidth},o));
		flipview.views.forEach(function(view,i){
			view.opacity = (i? 0 : 1); // only 1st view visible from the beginning
		});
		return flipview;
	};
	M.ui.createPharmacyTable = function(o){ // o has callback
		var tableView = K.create(K.merge({
			k_type: "TableView",
			k_click: o.callback
		},o));
		tableView.render = function(o){ // o can have chainid and callback
			pharmacies = [];
			o = (o || {});
			for(var pid in M.app.data.pharmacies){
				var pharmacy = M.app.data.pharmacies[pid];
				if ((!o.chainid) || (o.chainid == pharmacy.chainid)){
					pharmacies.push({
						k_type: "TableViewRow",
						title: pharmacy.name,
						pharmacy: pharmacy
					});
				}
			};
			tableView.setData(pharmacies);	
		};
		return tableView;
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
Ti.include("/mapotek/ui/homeTab.js");