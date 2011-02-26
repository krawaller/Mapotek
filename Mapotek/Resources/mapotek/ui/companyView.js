(function(){
	M.ui.createCompanyView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Company",
			k_children: [{
				text: "Company!!!",
				k_id: "companyname"
			}]
		}),
		label = view.k_children.companyname;
		view.render = function(e){
			label.text = "mm"+e.company;
			return label.text; // to be caught in report
		};
		return view;
	};
})();