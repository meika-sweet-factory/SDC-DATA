var google = require('google');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


var mysearch = function () {
    app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
	next();
    });
    function googlesearch(search, callback) {
	google.resultsPerPage = 5;

	google.lang = 'fr';
	google.tld = 'fr';
	google.nextText = 'fr';

	var arr = [];
	google(search, function (err, res) {
	    if (!err) {
		for (var i = 0; i < res.links.length; i++) {
		    var link = res.links[i];
		    if (link.href) {
			arr.push(link.href);
		    }
		}
		if (callback) callback(arr)
	    }
	});

    }
    return {
	googlesearch: googlesearch
    };
};

module.exports = mysearch;

// googleprint(function(arr) {
// console.log(arr);
// }, "william phetsinorath linkedin");
