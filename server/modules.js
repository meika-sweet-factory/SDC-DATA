const logger = require('morgan'),
      favicon = require('serve-favicon'),
      bodyParser = require('body-parser'),
      mongoElasticsearch = require('mongo-elasticsearch')

module.exports = (app) => {
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
	extended: false
    }))
    app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
	next()
    })
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
    tunnel.start().then((results) => {
	console.log(results);
	process.exit();
    });
    */
}
