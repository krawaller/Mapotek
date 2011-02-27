(function(){
	M.ui.createPharmacyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "PharmacyList",
			MapotekViewTitle: "Alla apotek",
			k_children: [{
				k_class: "NavButtonView",
				width: 100,
				top: 100,
				left: 50,
				k_children: [{
					k_class: "NavButtonLabel",
					text: "Booyah!"
				}],
				k_click: function(){
					Ti.App.fireEvent("showCompany",{company:"BOOYAH!"});
				}
			}]
		});
		view.add( K.create({k_type:"Label",text:"PharmacyList!"}) );
		return view;
	};
})();