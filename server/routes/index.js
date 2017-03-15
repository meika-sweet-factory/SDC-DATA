const express = require('express');
const router = express.Router();
const iconv = require('iconv-lite');
const request = require("request");
const cheerio = require("cheerio");

/* MOKER TO DO: Del this shit after */
const mokerName = 'AUCHAN';
const mokerSirene = '410409460';

router.get('/', function(req, res, next) {
    var target = {
	encoding: null,
	method: 'GET',
	uri: 'http://www.societe.com/societe/'+ mokerName + '-' + mokerSirene + '.html'
    };

    var json = { };

    request(target, (error, response, html) => {
	if (!error) {
	    let $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
	    let getInfo = function(classTarget, index) {
		return $($(classTarget)[index]).text();
	    }
	    let src1 = "#rensjur td";
	    let src2 = "#rensjurcomplete td";
	    json = {
		siren: getInfo(src1, 7),
		siret: getInfo(src1, 9),
		denomination: getInfo(src1, 1),
		denominationComplement: getInfo(src2, 9),
		legal: getInfo(src1, 15),
		employe: getInfo(src1, 21),
		category: getInfo(src2, 19),
		capital: getInfo(src1, 23),
		updateDate: getInfo(src1, 19).substring(0,8),
		date: {
		    companyCreated: getInfo(src2, 31),
		    headquarterCreated: getInfo(src2, 33)
		},
		location: {
		    address: getInfo(src1, 3).replace(/\n\s+/g, ""),
		    postal: getInfo(src2, 13),
		    city: getInfo(src2, 15),
		    country: getInfo(src2, 17)
		},
		rcs: {
		    date: getInfo(src2, 17).substring(0,8),
		    address: getInfo(src2, 11),
		},
		naf: {
		    registrationDate: getInfo(src2, 29),
		    companyCode: getInfo(src2, 21),
		    companyActivity: getInfo(src2, 23),
		    headquarterCode: getInfo(src2, 25),
		    headquarterActivity: getInfo(src2, 27)
		}
	    };
	}
	console.log(mokerName + ' API:\\n' + json);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(json));
    });
});
module.exports = router;
