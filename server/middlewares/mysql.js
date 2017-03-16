const mysql = require('mysql');

module.exports = mysql.createConnection({
    host : 'database-server',
    user : 'root',
    password : 'root',
    database : 'sirene'
});
