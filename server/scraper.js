var request = require('request');
var jsdom  = require('jsdom');
var fs = require('fs');
var sys = require('sys');
var Script = process.binding('evals').Script;
var requestDefaults = {
	'uri': null
	, 'headers': {
		'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
	}
};
var fetchDefaults = {
	'reqPerSec': 0
};
var jquery = fs.readFileSync('jquery-1.4.4.min.js').toString();

var running = 0,
	timeout = 200,
	concurrency = 4,
	queue = [],
	windows = [],
	requests = 0;

var window, tag;
for(var i = 0; i < concurrency; i++){
	window = jsdom.jsdom().createWindow();
	tag = window.document.createElement("script");
	tag.text = jquery;
	windows.push(window);
}

module.exports = function scrape(requestOptions, callback, fetchOptions) {
	if (!fetchOptions) {
		fetchOptions = {};
	}
	if (!callback) {
		callback = function(){};
	}
	Object.keys(fetchDefaults).forEach(function(key) {
		if (fetchOptions[key] === undefined) {
			fetchOptions[key] = fetchDefaults[key]
		}
	});

	(Array.isArray(requestOptions) ? requestOptions : [requestOptions]).forEach(function(requestOptions, index) {
		queue.push(function() {
			Object.keys(requestDefaults).forEach(function(key) {
				requestOptions[key] = requestOptions[key] || requestDefaults[key];
			});
			//console.log('req', requestOptions);
			if (typeof requestOptions === 'string') {
				requestOptions = {
					'uri': requestOptions
				}
			}

			if (!requestOptions['uri']) {
				callback(new Error('You must supply an uri.'), null, null);
			}

			running++;
			request(requestOptions, function (err, response, body) {
				setTimeout(runNextFetch, timeout);
				if (err) {
					callback(err, null, null);
				}
				if (response && response.statusCode == 200) {					
					var str = body
						.replace(/<\s*script/g, '<skript')
						.replace(/<\s*\/\s*script/g, '</skript')
						.replace(/\/\/\s*<!\[CDATA\[/g, '');

					var $ = windows[requests%concurrency].jQuery;
					
					$('body').html($(
						str
					).find('body').html());
					callback(null, $, requestOptions['uri']);					
				} else {
					callback(new Error('Request to '+requestOptions['uri']+' ended with status code: '+(typeof response !== 'undefined' ? response.statusCode : 'unknown')), null, null);
				}
				requests++;
				running--;
			});
		});
	});

	//console.log('current queue: ' + queue.length);
	for (var i=0; i < concurrency - running; i++) {
		runNextFetch();
	};

	function runNextFetch(i) {
		if (queue[0]) {
			queue[0]();
			queue.shift();
		}
	}
};