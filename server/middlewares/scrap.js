const cheerio = require('cheerio'),
      iconv = require('iconv-lite'),
      request = require('request'),
      cachedRequest = require('cached-request')(request),
      mysql = require("../middlewares/mysql.js"),
      google = require("../middlewares/google.js")

cachedRequest.setCacheDirectory("/tmp/cache")

const hlp = {
    sql: qry => 'SELECT siren FROM etna WHERE siren = ' + qry.siren,
    init: (qry, tgt, callback) => {
	if(qry) mysql.sql(hlp.sql(qry), rows => {
	    if(rows) google.query(rows[0].siren + ' ' + tgt, (lnk) => {
		var hed = {
			encoding: null,
			method: 'GET',
			uri: "",
			timeout: 10000,
			headers: {
			    'User-Agent': 'request'
			}
		}
		hed.uri = lnk
		callback(hed)
	    })
	})
    },
    asp: (tgt, bdy, cbk) => {
	var $ = cheerio.load(iconv.decode(new Buffer(bdy), 'ISO-8859-1'))
	var clt = (tgt, idx) => $($(tgt)[idx]).text()
	cbk(tgt, clt)
    }
}

module.exports = {
    societe: (qry, cbk) => {
	hlp.init(qry, 'societe.com', (hed) => {
	    request(hed, (err, res, bdy) => {
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
		    console.log("BOT: request isn't working: " + err)
		cbk(data)
	    })
	})
    },
    score3: (qry, cbk) => {
	hlp.init(qry, 'score3.fr', (hed) => request(hed, (err, res, bdy) => {
	    var data = {}
	    if(!err && res.statusCode == 200)
		hlp.asp([
		    '#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td',
		    '#infos'
		], bdy, (target, collect) => data = {
		    establishment: collect(target[0], 9).replace(/\n/g, ""),
		    director: collect(target[1] , 0)
		})
	    else
		console.log("BOT: request isn't working: " + err)
	    cbk(data)
	}))
    }
}
