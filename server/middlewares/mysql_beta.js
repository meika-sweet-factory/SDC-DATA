const mysql = require('mysql')

const hlp = {
}

module.exports = {
    init(query, callback){
	mysql.connect()
	mysql.query(query, (error, rows, fields) => {
	    if(!error){
		callback(rows, fields);
	    }
	})
	mysql.end()}
}
