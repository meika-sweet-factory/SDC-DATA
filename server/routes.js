let express = require("express");
let router = express.Router();

module.exports = function(app) {
    app.get('/_search', require('./routes/api'));
}
