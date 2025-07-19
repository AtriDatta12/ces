// lib/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // set to true if your DB requires SSL verification
  },
});

pool.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database.');
  }
});

module.exports = pool;
