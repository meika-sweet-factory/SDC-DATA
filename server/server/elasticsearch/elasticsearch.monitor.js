const config = require('./elasticsearch.config');

config.cluster.health({ },function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});