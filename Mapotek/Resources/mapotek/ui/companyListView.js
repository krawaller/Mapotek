(function(){
	M.ui.createCompanyListView = function(){
		var view = M.ui.createView({
			MapotekViewId: "CompanyList",
			MapotekViewTitle: "Alla apotekskedjor",
			k_children: [{
				top: 60,
				height: 20,
				text:"Alla olika apotekskedjor dårå!"
			},{
				k_type: "TableView",
				k_id: "chaintable",
				top: 100,
				k_click: function(e){
					view.fireEvent("zoom",{chain:e.row.chain});
				}
			}]
		});
		var chainlist = M.data.getChainList();
		view.k_children.chaintable.setData(chainlist.map(function(c){
			return K.create({
				k_type: "TableViewRow",
				title: c.name,
				chain: c
			});
		}));
		return view;
	};
})();