var scraper = require('./scraper'),
	CouchClient = require('./couch-client'),
	db = CouchClient("http://kra.couchone.com/mapotek");
	
var i = 0, max = 26;	
function scrape(){
	if(++i <= max){
		console.log('checking: ' + i);
		scraper('http://www.apotekhjartat.se/hitta-apotek-hjartat/?epslanguage=sv&q=*&resid=1350490027&id=21&defbn='+i+'&uaid=036E52D96484D848BC54C965AD9DC826:38332E3233332E3132382E313338:5245991571575188957', function(err, $) {
		    if (err) {throw err}
			console.log('oki');
			$('.pharmacy-search-result h2 a').each(function(){
				var href = $(this).attr('href');
				db.save({ apotek: 'Apotek Hjärtat', href: href });
			});
			setTimeout(scrape, 400);
		});
	}
}

scrape();