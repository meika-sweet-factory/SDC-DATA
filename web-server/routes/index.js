const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {

    MongoClient.connect(config.mongo.database, function(err, db) {
        assert.equal(null, err);
        res.render('index', { title: 'Express' });
        db.close();
    });

res.render('index', { title: 'Expres' });
});

module.exports = router;
