const mysql = require('mysql'),
      connection = mysql.createConnection({
	  host: 'database-server',
	  user: 'root',
	  password: 'root',
	  database: 'sirene'
      })

module.exports = {
    sql: (query, callback) => {
	if(query)
	    connection.query(query, (error, rows, fields) => {
		if(!error && rows != undefined)
		    callback(rows, fields)
		else
		    console.log("BOT: mysql request isn't working: " + error)
	    })
	else
	    console.log("BOT: no query for mysql request")
    }
}
