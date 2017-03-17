const cheerio = require('cheerio'),
      iconv = require('iconv-lite'),
      request = require('request'),
      cachedRequest = require('cached-request')(request),
      mysql = require("../middlewares/mysql.js"),
      google = require("../middlewares/google.js")

cachedRequest.setCacheDirectory("/tmp/cache")

const hlp = {
    sql: qry => 'SELECT siren FROM etna WHERE siren = ' + qry['siren'],
    opt: (qry, tgt) => {
	var out = { }
	if(qry)
	    mysql.sql(hlp.sql(qry), rows => {
		if(rows)
		    google.query(rows[0].siren + ' ' + tgt, (lnk) => {
			if(lnk)
			    out = {
				encoding: null,
				method: 'GET',
				uri: lnk,
				timeout: 10000,
				headers: {
				    'User-Agent': 'request'
				}
			    }
			else
			    console.log("BOT: can't connect to google")
		    })
		else
		    console.log("BOT: no element correspond to the request")
	    })
	else
	    console.log("BOT: no query entry")
	return out
    },
    asp: (tgt, bdy, cbk) => {
	var $ = cheerio.load(iconv.decode(new Buffer(bdy), 'ISO-8859-1'))
	var clt = (tgt, idx) => $($(tgt)[idx]).text()
	cbk(tgt, clt)
    }
}

module.exports = {
    societe: (qry, cbk) => {
	if(qry)
	    request(hlp.opt(qry, 'societe.com'), (err, res, bdy) => {
		var data = {}
		if(!err && res.statusCode == 200)
		    hlp.asp([
			'#rensjur td',
			'#rensjurcomplete td'
		    ], bdy, (target, collect) => data = {
			siret: collect(target[0], 9),
			name: collect(target[0], 1) + collect(target[1], 9),
			legalForm: collect(target[0], 15),
			category: collect(target[1], 19),
			capital: collect(target[0], 23),
			address: collect(target[0], 3).replace(/\n\s+/g, ""),
			companyCreated: collect(target[1], 31),
			seatCreated: collect(target[1], 33),
			rcs: {
			    date: collect(target[1], 17).substring(0,8),
			    address: collect(target[1], 11),
		    },
			naf: {
			    date: collect(target[1], 29),
			    code: collect(target[1], 21),
			    activity: collect(target[1], 23)
			},
			employeNumber: collect(target[0], 21)
		    })
		else
		    console.log("BOT: request isn't working")
		cbk(data)
	    })
	else
	    console.log("BOT: query is empty")
    },
    score3: (qry, cbk) => {
	if(qry) request(hlp.opt(qry, 'score3.fr'), (err, res, bdy) => {
	    var data = {}
	    if(!err && res.statusCode == 200)
		hlp.asp([
		    '#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td',
		    '#infos'
		], bdy, (target, collect) => data = {
		    establishment: collect(target[0], 9).replace(/\n/g, ""),
		    director: collect(target[1] , 0)
		})
	    cbk(data)
	})
    }
}
