const express = require('express');
const router = express.Router();

const aspirator = require("../middlewares/aspirator.js");

router.get('/_search', function(req, res, next) {
    console.log("Api open");

    var societeCollector = aspirator.societe(req.query);
    var score3Collector = aspirator.score3(req.query);

    Promise.all([
	societeCollector,
	score3Collector
    ]).then((pack) => res.json(Object.assign({}, pack[0], pack[1])));
});
module.exports = router;
