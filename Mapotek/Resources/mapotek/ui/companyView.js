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
			}]
		}),
		table = M.ui.createPharmacyTable({
			k_id: "pharmacytable",
			top: 120,
			callback: function(e){
				Ti.App.fireEvent("showPharmacy",{pharmacy:K.merge({chain:chain},e.row.pharmacy)});
				Ti.API.log(e.row.pharmacy);
			}
		});
		view.add(table);
		view.render = function(e){
			chain = e.chain;
			view.k_children.companydescription.text = chain.description;
			table.render({
				chainid: chain.chainid
			});
			Ti.API.log(["WPPP UÅDATING CHAIN!",chain]);
			return {
				title: chain.name,
				reportData: chain.name
			};
		};
		return view;
	};
})();