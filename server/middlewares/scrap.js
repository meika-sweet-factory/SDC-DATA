const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const request = require('request')

const hlp = {
    opt: tgt => {
	return {
	    encoding: null,
	    method: 'GET',
	    uri: tgt,
	    headers: {
		'User-Agent': 'request'
	    }
	}
    },
    asp: (tgt, bdy, cbk) => {
	var $ = cheerio.load(iconv.decode(new Buffer(bdy), 'ISO-8859-1'))
	var clt = (tgt, idx) => $($(tgt)[idx]).text()
	cbk(tgt, clt)
    }
}

module.exports = {
    societe: (qry, cbk) => request(hlp.opt('http://www.societe.com/societe/' + qry['company'] + '-' + qry['sirene'] + '.html'), (err, res, bdy) => {
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
	cbk(data)
    }),
    score3: (qry, cbk) => request(hlp.opt('https://www.score3.fr/' + qry['company'].toUpperCase + '-' + qry['sirene'] + '.shtml'), (err, res, bdy) => {
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
