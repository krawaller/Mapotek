var M = {};

(function() {

	M.app = {};

	M.data = {
		loadData: function(callback) {
			var fakeData = {
				pharmacies: {
					ah1: {
						pharmacyid: "ah1",
						chainid: "hjartat",
						name: "Örnen",
						address: {
							street: "Storgatan 3E",
							zipcode: "12345",
							city: "Storstad"
						},
						coords: {
							latitude: 1,
							longitude: 2
						}
					},
					ah2: {
						pharmacyid: "ah2",
						chainid: "hjartat",
						name: "Falken",
						address: {
							street: "Lillgatan 222E",
							zipcode: "54321",
							city: "Lillstad"
						},
						coords: {
							latitude: 3,
							longitude: 4
						}
					},
					m1: {
						pharmacyid: "m1",
						chainid: "medstop",
						name: "Medstop Mellanstad",
						address: {
							street: "Mellangatan 666",
							zipcode: "66666",
							city: "Mellanstad"
						},
						coords: {
							latitude: 5,
							longitude: 6
						}
					}
				},
				chains: {
					hjartat: {
						chainid: "hjartat",
						name: "Apotek hjärtat",
						description: "Apotek hjärtat dårå! Woo!",
						pharmacyids: ["ah1","ah2"]
					},
					medstop: {
						chainid: "medstop",
						name: "Medstop",
						description: "Medstop pledstop kredstop.",
						pharmacyids: ["m1"]
					}
				}
			};
			//setTimeout(function(){callback(data);},500);
			callback(fakeData);
		},
		getPharmacyById: function(id){
			return M.app.data.pharmacies[id];
		},
		getPharmacyList: function(){
			var ret = [];
			for(var pid in M.app.data.pharmacies){
				ret.push(M.data.getPharmacyById(pid));
			}
			return ret;
		},
		getChainById: function(id){
			var chain = M.app.data.chains[id];
			return chain;
		},
		getChainList: function(){
			var ret = [];
			for(var cid in M.app.data.chains){
				ret.push(M.data.getChainById(cid));
			}
			return ret;
		},
		receiveData: function(data) {
			M.app.data = data;
			Ti.App.fireEvent("app:data-updated");
		}
	};

})();

M.data.loadData(M.data.receiveData);

Ti.include("/assets/kralib.js");
Ti.include("/mapotek/ui/ui.js");
K.setStyles(M.ui.properties);
