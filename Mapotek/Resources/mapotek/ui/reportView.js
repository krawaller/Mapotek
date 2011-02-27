(function(){
	M.ui.createReportView = function(){
		var view = K.create({
			k_type:"View",
			backgroundColor: "rgba(0,0,0,0.8)",
			opacity:0,
			k_children:[{
				text: "Reporting about something!",
				k_id: "label",
				height: 40,
				width: 150,
				backgroundColor: "#FFF",
				borderWidth: 1,
				borderColor: "#000"
			}]}),
		label = view.k_children.label,
		visible = 0;
		
		Ti.App.addEventListener("app:report",function(e){
			Ti.API.log("MDOAPSDKSOPA");
			
			if (visible){
				visible = 0;
				view.animate({opacity:0});
			}
			else {
				visible = 1;
				view.animate({opacity:1});
				label.text = "Reporting about "+e.view+(e.what ? ", "+e.what:"")+"!";
			}
		});
		
		view.add(label);
		
		return view;
	};
})();