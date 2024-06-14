const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
const mysql =require('mysql2/promise')
/* const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@1998',
    database: 'store'
  });
   module.exports =pool */

    module.exports =pool 
//  host: process.env.HOST,
//  user: process.env.USER,
//  password: process.env.PASSWORD,
//  database: process.env.DATABASE,
//  waitForConnections: process.env.WAITFORCONNECTIONS,
//  connectionLimit: process.env.CONNECTIONLIMIT,
//  queueLimit: process.env.QUEUELIMIT
