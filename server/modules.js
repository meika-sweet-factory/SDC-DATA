const logger = require('morgan'),
      favicon = require('serve-favicon'),
      bodyParser = require('body-parser'),
      mongoElasticsearch = require('mongo-elasticsearch')

module.exports = function(app) {
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
	extended: false
    }))
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
