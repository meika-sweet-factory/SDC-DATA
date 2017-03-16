const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports = {
    societe: (dust) => new Promise((callback) => request({
	encoding: null,
	method: 'GET',
	uri: dust.source
    }, (error, response, html) => {
	let data = { };
	if (!error) {
	    console.log('Scrap: Societe');
	    const as = (classTarget, index) => {
		const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
		return $($(classTarget)[index]).text();
	    };
	    const a = dust.zone[0];
	    const b = dust.zone[1];
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
		    Code: as(b, 21),
		    Activity: as(b, 23)
		}
	    };
	    console.log('Scrap: Societe - END');
	}
	return callback(data);
    })),
    score3: (dust) => new Promise((callback) => request({
	encoding: null,
	method: 'GET',
	uri: dust.source
    }, (error, response, html) => {
	let data = { };
	if(!error) {
	    console.log('Scrap: Socre3');
	    const as = (classTarget, index) => {
		const $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
		return $($(classTarget)[index]).text();
	    };
	    const a = dust.zone[0];
	    data = {
		head: as(a, 8),
		head2: as(a, 9)
	    };
	    console.log('Scrap: Socre3 - END');
	}
	return callback(data);
    }))
};
