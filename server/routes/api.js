const express = require('express')
const async = require('async')

const scrap = require("../middlewares/scrap.js")

const router = express.Router()

router.get('/_search', function(req, res, next) {
    async.parallel({
	societe: function(callback) {
	    setTimeout(() => scrap.societe(req.query, data => callback(null, data)), 10)},
	score3: function(callback) {
	    setTimeout(() => scrap.score3(req.query, data => callback(null, data)), 10)}
    }, (error, result) => res.json(Object.assign({}, result.societe, result.score3)))
})

module.exports = router
