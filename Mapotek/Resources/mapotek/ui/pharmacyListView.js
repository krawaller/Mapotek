(function(){
	M.ui.createPharmacyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "PharmacyList",
			MapotekViewTitle: "Alla apotek",
			k_children: [{
				top: 60,
				height: 20,
				text:"Alla apotekskontor i heeeela landet WOOOO"
			}]
		}),
		table = M.ui.createPharmacyTable({
			top: 100,
			callback: function(e){
				view.fireEvent("zoom",{pharmacy:e.row.pharmacy});
			}
		});
		view.add(table);
		view.render = function(){
			table.render();
		};
		return view;
	};
})();