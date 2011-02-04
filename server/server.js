var scraper = require('./scraper');
/*scraper('http://localhost/apps/mapotek/server/hitta-apotek.html', function(err, $) {
    if (err) {throw err}

    $('.item-list .item-list a').each(function() {
        console.log($(this).text().trim());
    });
});*/
/*^[^\t]+\s*([^\t]+).*Kvar i Apoteket AB$
^.*?\s*([^\t]+)[\t\s]*Kvar i Apoteket AB$
^[^\t]+\t\s*[^\t]+\t\s*([^\t]+).*?\s*([^\t]+)[\t\s]*Kvar i Apoteket AB$*/
var stores = [];
scraper('http://localhost/apps/mapotek/server/eskilstuna.html', function(err, $) {
    if (err) {throw err}

	var m, ms, s, el, con, links, times, str, daystr,
		resoup = /lat:\s*([^,]+),\s*lng:\s*([^,]+),\s*text:\s*&#39([^&]*(?:(?!&#39)&[^&]*)*)&#39/g,
		reday = /([\wåäö]+)\s*([\d:]+)\s*-\s*([\d:]+)/;
		
    $('skript:eq(0)').each(function() {
        str = $(this).html();
		keep = true;
		while(keep && (m = resoup.exec(str))){
			el = $('<div>' + (m[3] || '') + '</div>');
			con = el.contents();
			links = el.find('a');
			times = {};
			el.find('span div').each(function(){
				daystr = $(this).text();
				if(ms = daystr.match(reday)){
					times[ms[1]] = {
						open: ms[2],
						close: ms[3]
					};
				}
			});
			
			stores.push({
				lat: m[1],
				lon: m[2],
				name: el.find('b:eq(0)').text(),
				phone: links.eq(0).text(),
				email: links.eq(1).text(),
				place: con.get(3).nodeValue,
				city: con.get(5).nodeValue,
				times: times
			});
		}
		console.log(stores);
    });
});