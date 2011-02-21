var M = {};

(function() {

	M.app = {};

	M.data = {
		loadData: function(callback) {
			var fakeData = {
				pharmacies: [{
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
				}]
			};
			setTimeout(function(){callback(data);},500);
		},
		receiveData: function(data) {
			M.app.data = data;
			Ti.App.fireEvent("app:data-updated");
		}
	};

	var empty = {};


	function mixin(
	/*Object*/
	target,
	/*Object*/
	source) {
		var name, s, i;
		for (name in source) {
			s = source[name];
			if (! (name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))) {
				target[name] = s;
			}
		}
		return target; // Object
	};
	Object.mixin = function(
	/*Object*/
	obj,
	/*Object...*/
	props) {
		if (!obj) {
			obj = {};
		}
		for (var i = 1, l = arguments.length; i < l; i++) {
			mixin(obj, arguments[i]);
		}
		return obj; // Object
	};

	//create a new object, combining the properties of the passed objects with the last arguments having
	//priority over the first ones
	Object.combine = function(
	/*Object*/
	obj,
	/*Object...*/
	props) {
		var newObj = {};
		for (var i = 0, l = arguments.length; i < l; i++) {
			mixin(newObj, arguments[i]);
		}
		return newObj;
	};

	var osname = Ti.Platform.osname;
	M.os = function(
	/*Object*/
	map) {
		var def = map.def || null; //default function or value
		if (typeof map[osname] != 'undefined') {
			if (typeof map[osname] == 'function') {
				return map[osname]();
			} else {
				return map[osname];
			}
		} else {
			if (typeof def == 'function') {
				return def();
			} else {
				return def;
			}
		}
	};
})();

Ti.include("/mapotek/ui/ui.js");
