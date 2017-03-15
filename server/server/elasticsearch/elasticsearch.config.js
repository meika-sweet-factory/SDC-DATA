const elasticsearch = require('elasticsearch');
const config = require('../../config');

var client = new elasticsearch.Client({
    hosts: [
        'https://' + config.elasticsearch.username + ':' + config.elasticsearch.passwordd + '@' + config.elasticsearch.server + ':' + config.elasticsearch.port + '/'
    ]
});
module.exports = client;