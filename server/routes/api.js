const express = require('express');
const router = express.Router();

const aspirator = require("../middlewares/aspirator.js");

router.get('/api/:company/:sirene', function(req, res, next) {
    Promise.all([
	aspirator.societe({
	    source: 'http://www.societe.com/societe/' + req.params.company + '-' + req.params.sirene + '.html',
	    zone: [
		"#rensjur td",
		"#rensjurcomplete td"
	    ]}),
	aspirator.score3({
	    source: 'https://www.score3.fr/' + req.params.company + '-' + req.params.sirene + '.shtml',
	    zone: [
		"#entreprise div:nth-child(6) div:nth-child(2) div:nth-child(1) td"
	    ]
	})
    ]).then((pack) => res.json(Object.assign({}, pack[0], pack[1])));
});
module.exports = router;
