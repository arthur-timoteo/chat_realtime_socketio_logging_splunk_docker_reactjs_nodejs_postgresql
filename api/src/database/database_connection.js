const { Pool } = require('pg');

/*const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'chatproject',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5435,
});*/

const pool = new Pool({
  user: 'postgres',
  host: 'database',
  database: 'chatproject',
  password: 'postgres',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};