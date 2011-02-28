(function(){
	M.ui.createPharmacyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "PharmacyList",
			MapotekViewTitle: "Alla apotek",
			k_children: [{
				top: 60,
				height: 20,
				text:"Alla apotekskontor i heeeela landet WOOOO"
			},{
				k_type: "TableView",
				k_id: "pharmacytable",
				top: 100,
				k_click: function(e){
					view.fireEvent("zoom",{pharmacy:e.row.pharmacy});
				}
			}]
		});
		var pharmacylist = M.data.getPharmacyList();
		view.k_children.pharmacytable.setData(pharmacylist.map(function(p){
			return K.create({
				k_type: "TableViewRow",
				title: p.name,
				pharmacy: p
			});
		}));
		return view;
	};
})();