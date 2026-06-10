const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dimri@3009',
    database: 'apnamart_db'
});

connection.connect((err)=>{
    if(err){
        console.error('Error has occurred: ',err.message);
        return;
    }
    console.log('Connected to Mysql');
});

module.exports = connection;