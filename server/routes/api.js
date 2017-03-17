const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const iconv = require('iconv-lite');
const mysql = require('../middlewares/mysql.js');
const router = express.Router();

router.get('/_search', function(req, res, next) {
//    mysql.connect();
//    mysql.query('SELECT siren FROM etna WHERE siren = ' + req.query['sirene'] + ' OR siret = ' + req.query['sirene'] , function(err, rows, fields) {
//    	if (!err && rows[0].siren) {
          async.parallel({
		societe: function (callback) {
		    setTimeout(() => request({
			encoding: null,
			method: 'GET',
			uri: 'http://www.societe.com/societe/' + req.query['company'] + '-' + req.query['sirene'] + '.html'
		    }, (error, response, html) => {
			let data = { };
			if (!error) {
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
				},
				employeNumber: as(a, 21)
			    };
			}
			callback(null, data);
		    }), 10);
		},
		score3: function (callback) {
		    setTimeout(() => request({
			encoding: null,
			method: 'GET',
			uri: 'https://www.score3.fr/' + req.query['company'].toUpperCase + '-' + req.query['sirene'] + '.shtml'
		    }, (error, response, html) => {
			let data = { };
			if(!error) {
			    const as = (classTarget, index) => {
				const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
				return $($(classTarget)[index]).text();
			    };
			    const a = "#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td";
			    const b = "#infos";
			    data = {
				establishment: as(a, 9).replace(/\n/g, ""),
				director: as(b, 0)
			    };
			}
			callback(null, data);
		    }), 10);
		}
	    }, (error, results) => {
		res.json(Object.assign(results.societe, results.score3));
	    });
			 	} else
			 	    console.log(err);
					let json = { error: "No entry in database"}		
			     });
//    mysql.end();
});
module.exports = router;
