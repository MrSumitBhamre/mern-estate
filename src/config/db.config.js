const mysql = require('mysql2/promise');
const env = require('./env.config');

/**
 * MySQL Connection Pool
 * Production ready:
 * - Connection pooling
 * - Queue handling
 * - Prevent connection exhaustion
 */
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 20, // Scalable
  queueLimit: 0
});

module.exports = pool;