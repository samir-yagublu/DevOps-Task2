const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'project'
    })


module.exports= db;