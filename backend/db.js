const mysql = require('mysql2');

// Configuration for your Remote MySQL Server
const pool = mysql.createPool({
  host: '82.25.121.80',             // The IP you provided
  user: 'u131922718_iitjee_tracker', // Usually the username matches DB name on shared hosting
  password: 'HC2>RF|J>a!9',      // REPLACE THIS with your actual database password
  database: 'u131922718_iitjee_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.code);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused. Check IP whitelisting.');
    }
  } else {
    console.log('✅ Connected to Remote MySQL (82.25.121.80)');
    connection.release();
  }
});

module.exports = pool.promise();