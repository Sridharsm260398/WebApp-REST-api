const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
const mysql = require('mysql')
/* const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@1998',
    database: 'store'
  });
   module.exports =pool */
  const pool = mysql.createPool({
     host: 'mysqlfortesting.mysql.database.azure.com',
     user: 'sridharazure',
     password: 'azure@2225146',
     database: 'store',
     port:3306,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
     ssl:{
        rejectUnauthorized:false
     }
   });
    module.exports =pool 
//  host: process.env.HOST,
//  user: process.env.USER,
//  password: process.env.PASSWORD,
//  database: process.env.DATABASE,
//  waitForConnections: process.env.WAITFORCONNECTIONS,
//  connectionLimit: process.env.CONNECTIONLIMIT,
//  queueLimit: process.env.QUEUELIMIT
//for invoice
module.exports = pool
