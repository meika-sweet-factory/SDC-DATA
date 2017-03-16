const express = require('express');
const router = express.Router();
const iconv = require('iconv-lite');
const request = require("request");
const cheerio = require("cheerio");

router.get('/api/:company/:sirene', function(req, res, next) {
    var json = { };

    // BEGIN
    console.log(req.params.company + req.params.sirene + ':');

    // STEP 01  SOCIETE
    request(target = {
	encoding: null,
	method: 'GET',
	uri: 'http://www.societe.com/societe/' + req.params.company + '-' + req.params.sirene + '.html'
    }, (error, response, html) => {
	if (!error) {
	    const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
	    const getInfo = function(classTarget, index) {
		return $($(classTarget)[index]).text();
	    };
	    const src = "#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td";
	    const src1 = "#rensjur td";
	    const src2 = "#rensjurcomplete td";
	    let data = {};
	    data = {
		siret: getInfo(src1, 9),
		result: {
		    name: getInfo(src1, 1),
		    nameComplement: getInfo(src2, 9),
		    legalForm: getInfo(src1, 15),
		    employeNumber: getInfo(src1, 21),
		    category: getInfo(src2, 19),
		    capital: getInfo(src1, 23),
		    address: getInfo(src1, 3).replace(/\n\s+/g, ""),
		    companyCreated: getInfo(src2, 31),
		    seatCreated: getInfo(src2, 33),
		    rcs: {
			date: getInfo(src2, 17).substring(0,8),
			address: getInfo(src2, 11),
		    },
		    naf: {
			date: getInfo(src2, 29),
			Code: getInfo(src2, 21),
			Activity: getInfo(src2, 23)
		    }
		},
		source: {
		    societe: target.uri
		},
		updateDate: getInfo(src1, 19).substring(0,8)
	    };
	    console.log(data);
	    Object.assign(json, data);
	}
    });

    // STEP 02 SCORE3
    request({
	encoding: null,
	method: 'GET',
	uri: 'https://www.score3.fr/' + req.params.company + '-' + req.params.sirene + '.shtml'
    }, (error, response, html) => {
	if(!error) {
	    const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
	    const getInfo = function(classTarget, index) {
		return $($(classTarget)[index]).text();
	    };
	    const src = "#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td";
	    let data = {};
	    data = {
		head: getInfo(src, 8),
		head2: getInfo(src, 9)
	    }
	    console.log(data);
	    Object.assign(json, data);
	}
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(json));
});
module.exports = router;
