(function(){
	M.ui.createCompanyView = function(){
		var chain;
		var view = M.ui.createView({
			MapotekViewId: "Company",
			MapotekViewTitle: "foobar",
			k_children: [{
				text: "Company!!!",
				top: 60,
				width: 200,
				height: 40,
				left: 40,
				k_id: "companydescription"
			},{
				k_class: "InfoLabel",
				text: "Ingående apotek:",
				top: 100,
				height: 20
			},{
				k_type: "TableView",
				k_id: "pharmacytable",
				top: 120,
				k_click: function(e){
					Ti.App.fireEvent("showPharmacy",{pharmacy:K.merge({chain:chain},e.row.pharmacy)});
					Ti.API.log(e.row.pharmacy);
				}
			}]
		});
		view.render = function(e){
			chain = e.chain;
			view.k_children.companydescription.text = chain.description;
			Ti.API.log(["WPPP UÅDATING CHAIN!",chain]);
			view.k_children.pharmacytable.setData(e.chain.pharmacies.map(function(p){
				Ti.API.log(["mOOO",p]);
				return K.create({
					k_type: "TableViewRow",
					title: p.name,
					pharmacy: p
				});
			}));
			return {
				title: chain.name,
				reportData: chain.name
			};
		};
		return view;
	};
})();