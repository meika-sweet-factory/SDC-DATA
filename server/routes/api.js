const express = require('express'),
      async = require('async'),
      scrap = require("../middlewares/scrap.js"),
      router = express.Router()

router.get('/_search', function(req, res, next) {
    async.parallel({
	societe: (callback) => {
	    setTimeout(() => scrap.societe(req.query, data => callback(null, data)), 10)
	},
	score3: (callback) => {
	    setTimeout(() => scrap.score3(req.query, data => callback(null, data)), 10)
	}
    }, (error, result) => res.json(Object.assign({}, result.score3)))
})

module.exports = router
