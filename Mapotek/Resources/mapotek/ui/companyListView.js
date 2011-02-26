(function(){
	M.ui.createCompanyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "CompanyList",
			k_children: [{
				text:"CompanyList!"
			}]
		});
		["foo","bar","baz"].forEach(function(label,i){
			view.add(K.create({
				k_type:"View",
				height: 30,
				width: 160,
				left: 100,
				top: 50*(i+1),
				borderColor: "#000",
				borderWidth: 1,
				k_children: [{
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