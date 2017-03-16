const logger = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoElasticsearch = require('mongo-elasticsearch');

module.exports = function(app) {
    // Basic
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    // Debugger
    app.use(logger('dev'));

    // Parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Elasticsearch rich
    /*
    let tunnel = new mongoElasticsearch.Transfer({
	esOpts: {
	    host: 'database:9200',
	    log: 'trace'
	},
	esTargetType: 'entreprise',
	esTargetIndex: 'sirene',
	mongoUri: 'mongodb://database-server:27017/webbot',
	mongoSourceCollection: 'sirene'
    });
    tunnel.start().then(function(results) {
	console.log(results);
	process.exit();
    });
    */
}
