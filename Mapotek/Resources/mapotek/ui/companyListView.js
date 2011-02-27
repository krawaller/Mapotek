(function(){
	M.ui.createCompanyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "CompanyList",
			MapotekViewTitle: "Alla apotekskedjor",
			k_children: [{
				text:"CompanyList!"
			}]
		});
		["foo","bar","baz"].forEach(function(label,i){
			view.add(K.create({
				k_class:"NavButtonView",
				width: 160,
				left: 100,
				top: 50*(i+1),
				k_children: [{
					k_class: "NavButtonLabel",
					text: label
				}],
				k_click: function(){
					view.fireEvent("zoom",{company:label});
				}
			}));
		});
		return view;
	};
})();