const mysql = require('mysql'),
      connection = mysql.createConnection({
	  host: 'database-server',
	  user: 'root',
	  password: 'root',
	  database: 'sirene'
      })

module.exports = {
    sql: (query, callback) => {
	connection.connect()
	if(query)
	    connection.query(query, (error, rows, fields) => {
		if(!error)
		    callback(rows, fields)
		else
		    console.log("BOT: mysql request isn't working: " + error)
	    })
	else
	    console.log("BOT: no query for mysql request")
	connection.end()
    }
}
