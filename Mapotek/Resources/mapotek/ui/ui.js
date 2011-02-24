(function(){
	M.ui = {
	};
	M.ui.createFilmStripView = function(_args) {
		var root = K.create({k_type:"View"}),
		views = _args.views,
		index = 0,
		previndex = 0,
		container = K.create({
			k_type: "View",
			top:0,
			left:0,
			bottom:0,
			width:$$.platformWidth*_args.views.length
		});
			
		for (var i = 0, l = views.length; i<l; i++) {
			var newView = K.create({
				k_type: "View",
				top:0,
				bottom:0,
				left:$$.platformWidth*i,
				width:$$.platformWidth
			});
			newView.add(views[i]);
			container.add(newView);
		}
		root.add(container);
		
		//set the currently visible index
		root.addEventListener('changeIndex', function(e) {
			previndex = index;
			index = e.idx;
			if (_args.leave){
				_args.leave({from:previndex,to:index});
			}
			container.animate({
				duration:$$.animationDuration,
				left:$$.platformWidth*e.idx*-1
			},function(){
				if (_args.arrive){
					_args.arrive({from:previndex,to:index});
				}
			});
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