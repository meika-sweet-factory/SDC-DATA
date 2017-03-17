const express = require("express");
const router = express.Router();

module.exports = function(app) {
    app.get('/_search', require('./routes/api'));
}
