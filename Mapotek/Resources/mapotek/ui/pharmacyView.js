(function(){
	M.ui.createPharmacyView = function(){
		var pharmacy, chain;
		var view = M.ui.createView({
			MapotekViewId: "Pharmacy",
			MapotekViewTitle: "foobar",
			k_children: [{
				top: 60,
				height: 20,
				text: "FOOBAR!!!",
				k_id: "pharmacyname"
			},{
				top: 100,
				k_class: "NavButtonView",
				k_id: "mapview",
				k_children: [{
					k_class: "NavButtonLabel",
					text: "Se på karta"
				}],
				k_click: function(){
					Ti.App.fireEvent("showMap",{coords:pharmacy.coords});
				}
			},{
				top: 150,
				k_class: "NavButtonView",
				k_id: "chainlinkview",
				k_children: [{
					k_class: "NavButtonLabel"
				}],
				k_click: function(){
					Ti.App.fireEvent("showChain",{chain:M.data.getChainById(chain.chainid)});
				}
			}]
		}),
		label = view.k_children.pharmacyname;
		view.render = function(e){
			pharmacy = e.pharmacy;
			chain = M.data.getChainById(e.pharmacy.chainid);
			label.text = e.pharmacy.name+" i "+e.pharmacy.address.city;
			view.k_children.chainlinkview.k_children[0].text = chain.name;
			return {
				title: e.pharmacy.name+" i "+e.pharmacy.address.city,
				reportData: e.pharmacy.name+"/"+e.pharmacy.address.city
			};
		};
		return view;
	};
})();