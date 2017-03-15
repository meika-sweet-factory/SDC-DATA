const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config.js');
const router = express.Router();
const mongoElasticsearch = require('mongo-elasticsearch');

var t = new mongoElasticsearch.Transfer({
  esOpts: {
    host: 'database-search',
    log: 'trace'
  },
  esTargetType: 'entreprise',
  esTargetIndex: 'bot',
  mongoUri: config.mongo.database,
  mongoSourceCollection: 'sirene'
});
 
t.start().then(function(results) {
  console.log('Exiting');
  console.log(results);
  process.exit();
});

/* GET home page. */
router.get('/', function(req, res, next) {

    MongoClient.connect(config.database, function(err, db) {
        assert.equal(null, err);
        request('http://www.score3.fr/', function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var title, release, rating;
                var json = { title: "", release: "", rating: "" };

                // We'll use the unique header class as a starting point.

                $('.title_wrapper').filter(function() {

                    // Let's store the data we filter into a variable so we can easily see what's going on.

                    var data = $(this);

                    // In examining the DOM we notice that the title rests within the first child element of the header tag.
                    // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                    title = data.children().first().text();

                    // Once we have our title, we'll store it to the our json object.

                    json.title = title;

                    console.log(title);
                })
            }
        });
        res.render('index', { title: 'Express' });
        db.close();
    });
});

module.exports = router;
