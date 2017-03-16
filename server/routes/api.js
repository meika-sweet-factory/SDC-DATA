const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const router = express.Router();

router.get('/_search', function(req, res, next) {
    console.log("Api open");

    var start = Date.now();

    Promise.all([
	new Promise((resolve, reject) => {
	    request({
		encoding: null,
		method: 'GET',
		uri: 'https://www.score3.fr/' + req.query['company'] + '-' + req.query['sirene'] + '.shtml'
	    }, (error, response, html) => {
		let data = { };
		if(!error) {
		    console.log('Scrap: Socre3');
		    const as = (classTarget, index) => {
			const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
			return $($(classTarget)[index]).text();
		    };
		    const a = "#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td";
		    data = {
			head: as(a, 8),
			head2: as(a, 9)
		    };
		}
		console.log('Scrap: Socre3 - END' + (Date.now() - start) + "ms");
	    return resolve(data);
	    });
	}),
	new Promise((resolve, reject) => {
	    request({
		encoding: null,
		method: 'GET',
		uri: 'http://www.societe.com/societe/' + req.query['company'] + '-' + req.query['sirene'] + '.html'
	    }, (error, response, html) => {
		let data = { };
		if (!error) {
		    console.log('Scrap: Societe');
		    const as = (classTarget, index) => {
			const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
			return $($(classTarget)[index]).text();
		    };
		    const a = "#rensjur td";
		    const b = "#rensjurcomplete td";
		    data = {
			siret: as(a, 9),
			name: as(a, 1),
			nameComplement: as(b, 9),
			legalForm: as(a, 15),
			employeNumber: as(a, 21),
			category: as(b, 19),
			capital: as(a, 23),
			address: as(a, 3).replace(/\n\s+/g, ""),
			companyCreated: as(b, 31),
			seatCreated: as(b, 33),
			rcs: {
			date: as(b, 17).substring(0,8),
			    address: as(b, 11),
			},
			naf: {
			    date: as(b, 29),
			    code: as(b, 21),
			    activity: as(b, 23)
			}
		    };
		}
		console.log('Scrap: Societe - END' + (Date.now() - start) + "ms");
		return resolve(data);
	    })
	})
    ]).then(pack => res.json(Object.assign({}, pack[0], pack[1])))
});
module.exports = router;
