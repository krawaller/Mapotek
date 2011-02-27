var M = {};

(function() {

	M.app = {};

	M.data = {
		loadData: function(callback) {
			var fakeData = {
				pharmacies: {
					ah1: {
						"chain": "Apotek Hjärtat",
						"name": "Örnen",
						"address": {
							"street": "Storgatan 3E",
							"zipcode": "12345",
							"city": "Storstad"
						},
						"coords": {
							"latitude": 55.21341324,
							"longitude": 16.5431434
						}
					}
				},
				chains: {
					hjartat: {
						name: "Apotek hjärtat",
						description: "Mooo",
						logo: ""
					},
					pharmacies: ["ah1"]
				}
			};
			setTimeout(function(){callback(data);},500);
		},
		receiveData: function(data) {
			M.app.data = data;
			Ti.App.fireEvent("app:data-updated");
		}
	};

})();

Ti.include("/assets/kralib.js");
Ti.include("/mapotek/ui/ui.js");
K.setStyles(M.ui.properties);
