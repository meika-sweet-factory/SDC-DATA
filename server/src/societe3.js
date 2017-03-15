const request = require("request");
const cheerio = require("cheerio");
var pag = [];
var pag2 = [];

var url = 'http://www.societe.com/societe/'+'AUCHAN' + '-' + '410409460' + '.html';

var scrape = function(callback, url) {
    request(url, function(error, response, body) {
        if (error) {
            return console.error('upload failed:', error);
        }
        var $ = cheerio.load(body, { decodeEntities: false });
        links = $("#rensjur td");
        $(links).each(function(i, link){
            var title = $(this).text();
            pag[i] = title;
        });
        links = $("#rensjurcomplete td");
        $(links).each(function(i, link){
            var title2 = $(this).text();
            pag2[i] = title2;
        });
        if (callback) callback(pag, pag2);
    });
};

scrape(function(pag, pag2) {
    console.log(pag);
    console.log(pag2);
}, url);
