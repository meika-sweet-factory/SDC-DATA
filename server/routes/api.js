const express = require('express');
const router = express.Router();
const iconv = require('iconv-lite');
const request = require("request");
const cheerio = require("cheerio");

router.get('/api/:company/:sirene', function(req, res, next) {
    let json = { };
    let target = {
	encoding: null,
	method: 'GET',
	uri: 'http://www.societe.com/societe/' + req.params.company + '-' + req.params.sirene + '.html'
    };

    var soulsociety = function( target, callback ) {
	request(target, (error, response, html) => {
	let $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
	let getInfo = function(classTarget, index) {
	    return $($(classTarget)[index]).text();
	};
	
	if (!error) {
	    let src1 = "#rensjur td";
	    let src2 = "#rensjurcomplete td";
	    json = {
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
	    console.log(req.params.company + req.params.sirene + ':');
	    console.log(json);
	    if (callback) callback(json);
	
	
	}
	});
    }
    soulsociety( target, function(json) {
	target2 = {
	    encoding: null,
	    method: 'GET',
	    uri: 'https://www.score3.fr/' + req.params.company + '-' + req.params.sirene + '.shtml'
	};
	
	request(target2, (error, response, html) => {
	    let $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
	    let getInfo = function(classTarget, index) {
		return $($(classTarget)[index]).text();
	    };
	    if(!error) {
		let src = "#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td";
		console.log(getInfo(src, 8));
		console.log(getInfo(src, 9));
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(json));
	    }
	});
    });
});
module.exports = router;
