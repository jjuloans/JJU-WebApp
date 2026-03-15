'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'jju_user', host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jju_bank', password: process.env.DB_PASSWORD || 'jju_pass123',
  port: parseInt(process.env.DB_PORT || '5432'),
});
async function run() {
  const client = await pool.connect();
  for (const t of ['fd_accounts','od_loans','saving_accounts','memberships','cashbook_entries']) {
    const { rows } = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name=$1 ORDER BY ordinal_position`, [t]);
    console.log(`\n${t}:\n  ` + rows.map(r=>r.column_name).join(', '));
  }
  client.release(); await pool.end();
}
run();
