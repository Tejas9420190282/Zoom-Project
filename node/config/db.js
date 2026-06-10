// db.js

const mysql = require('mysql2/promise');

// create the connection to database
const mySqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'zoomproject',
});

exports.mySqlPool = mySqlPool;
