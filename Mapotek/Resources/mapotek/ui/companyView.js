(function(){
	M.ui.createCompanyView = function(){
		var view = M.ui.createView({
			MapotekViewId: "Company",
			MapotekViewTitle: "foobar",
			k_children: [{
				text: "Company!!!",
				k_id: "companyname"
			}]
		}),
		label = view.k_children.companyname;
		view.render = function(e){
			label.text = "mm"+e.company;
			return {
				title: label.text,
				reportData: label.text
			};
		};
		return view;
	};
})();