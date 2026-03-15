'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user:     process.env.DB_USER     || 'jju_user',
  host:     process.env.DB_HOST     || 'localhost',
  database: process.env.DB_NAME     || 'jju_bank',
  password: process.env.DB_PASSWORD || 'jju_pass123',
  port:     parseInt(process.env.DB_PORT || '5432'),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

module.exports = pool;
