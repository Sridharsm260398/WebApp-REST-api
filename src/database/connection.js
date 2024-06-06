/* const mysql = require('mysql')
const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@1998',
    database: 'store'
  });
   module.exports =pool */

//for invoice
   const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@1998',
    database: 'store',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
  });
   module.exports =pool