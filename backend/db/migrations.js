'use strict';
const pool = require('./pool');

// Every statement runs independently — no transaction, no cascade failures.
async function run(sql) {
  try {
    await pool.query(sql);
  } catch (err) {
    const ignore = [
      '42701', '42P07', '42710', '23505', '42P16',
      '42703', '22P02', '22007', '23502', '42804', '0A000', '42P01',
    ];
    if (!ignore.includes(err.code)) {
      console.warn(`  ⚠ [${err.code}] ${err.message.split('\n')[0]}`);
    }
  }
}

// Null-out empty strings before a date cast
function cleanDate(table, col) {
  return `UPDATE ${table} SET ${col} = NULL WHERE ${col}::text = '' OR TRIM(${col}::text) = ''`;
}

async function runMigrations() {
  console.log('Running migrations...');

  await run(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$
  `);

  // ── 1. RECORDS ────────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS records (
    id              SERIAL PRIMARY KEY,
    date            DATE,
    name            TEXT,
    customer_id     TEXT,
    customer_type   TEXT        DEFAULT 'regular',
    aadhar          TEXT,
    mobile          TEXT,
    account_no      TEXT,
    section         TEXT,
    tx_types        TEXT,
    data            JSONB       DEFAULT '{}',
    remarks         TEXT,
    sonar_parent_no TEXT,
    sonar_sub_no    TEXT,
    sonar_group_no  TEXT,
    status          TEXT        DEFAULT 'active',
    closed_date     DATE,
    closed_remarks  TEXT,
    closed_tx_types TEXT,
    is_deleted      BOOLEAN     DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`);
  for (const s of [
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS customer_id     TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS customer_type   TEXT DEFAULT 'regular'`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS sonar_parent_no TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS sonar_sub_no    TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS sonar_group_no  TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS closed_date     DATE`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS closed_remarks  TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS closed_tx_types TEXT`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS is_deleted      BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS deleted_at      TIMESTAMPTZ`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS status          TEXT DEFAULT 'active'`,
    `ALTER TABLE records ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ DEFAULT NOW()`,
  ]) await run(s);

  // Fix data column (TEXT → JSONB)
  await run(`UPDATE records SET data = '{}' WHERE data IS NULL OR TRIM(data::text) = '' OR data::text !~ '^[\\[{]'`);
  await run(`ALTER TABLE records ALTER COLUMN data DROP DEFAULT`);
  await run(`ALTER TABLE records ALTER COLUMN data TYPE jsonb USING CASE WHEN data IS NULL OR data::text='' THEN '{}'::jsonb ELSE data::jsonb END`);
  await run(`ALTER TABLE records ALTER COLUMN data SET DEFAULT '{}'`);

  // Fix date columns
  await run(`ALTER TABLE records ALTER COLUMN date DROP NOT NULL`);
  await run(cleanDate('records', 'date'));
  await run(`ALTER TABLE records ALTER COLUMN date TYPE date USING CASE WHEN date IS NULL THEN NULL ELSE date::text::date END`);
  await run(`ALTER TABLE records ALTER COLUMN closed_date DROP NOT NULL`);
  await run(cleanDate('records', 'closed_date'));
  await run(`ALTER TABLE records ALTER COLUMN closed_date TYPE date USING CASE WHEN closed_date IS NULL THEN NULL ELSE closed_date::text::date END`);

  for (const s of [
    `CREATE INDEX IF NOT EXISTS idx_records_date       ON records(date)`,
    `CREATE INDEX IF NOT EXISTS idx_records_section    ON records(section)`,
    `CREATE INDEX IF NOT EXISTS idx_records_status     ON records(status)`,
    `CREATE INDEX IF NOT EXISTS idx_records_is_deleted ON records(is_deleted)`,
    `CREATE INDEX IF NOT EXISTS idx_records_aadhar     ON records(aadhar)`,
    `CREATE INDEX IF NOT EXISTS idx_records_mobile     ON records(mobile)`,
    `CREATE INDEX IF NOT EXISTS idx_records_account_no ON records(account_no)`,
    `CREATE INDEX IF NOT EXISTS idx_records_name       ON records(LOWER(name))`,
    `DO $$ BEGIN CREATE TRIGGER trg_records_updated_at BEFORE UPDATE ON records FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 2. CASHBOOK ENTRIES ───────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS cashbook_entries (
    id          SERIAL PRIMARY KEY,
    date        DATE,
    entry_date  DATE,
    record_id   INTEGER REFERENCES records(id) ON DELETE SET NULL,
    name        TEXT,
    task        TEXT,
    acc_type    TEXT,
    tx_type     TEXT,
    acc_no      TEXT,
    amount      NUMERIC     DEFAULT 0,
    mode        TEXT,
    scroll_no   TEXT,
    loan_date   DATE,
    sort_order  INTEGER     DEFAULT 0,
    is_deleted  BOOLEAN     DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  )`);
  for (const s of [
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS record_id  INTEGER`,
    `DO $$ BEGIN ALTER TABLE cashbook_entries ADD CONSTRAINT fk_cashbook_record FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS entry_date DATE`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS name       TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS task       TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS acc_type   TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS tx_type    TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS acc_no     TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS mode       TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS scroll_no  TEXT`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS loan_date  DATE`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ`,
    `ALTER TABLE cashbook_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`,
  ]) await run(s);

  await run(`ALTER TABLE cashbook_entries ALTER COLUMN date DROP NOT NULL`);
  await run(cleanDate('cashbook_entries', 'date'));
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN date TYPE date USING CASE WHEN date IS NULL THEN NULL ELSE date::text::date END`);
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN entry_date DROP NOT NULL`);
  await run(cleanDate('cashbook_entries', 'entry_date'));
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN entry_date TYPE date USING CASE WHEN entry_date IS NULL THEN NULL ELSE entry_date::text::date END`);
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN entry_date SET DEFAULT CURRENT_DATE`);
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN loan_date DROP NOT NULL`);
  await run(cleanDate('cashbook_entries', 'loan_date'));
  await run(`ALTER TABLE cashbook_entries ALTER COLUMN loan_date TYPE date USING CASE WHEN loan_date IS NULL THEN NULL ELSE loan_date::text::date END`);

  for (const s of [
    `CREATE INDEX IF NOT EXISTS idx_cashbook_date       ON cashbook_entries(date)`,
    `CREATE INDEX IF NOT EXISTS idx_cashbook_record_id  ON cashbook_entries(record_id)`,
    `CREATE INDEX IF NOT EXISTS idx_cashbook_is_deleted ON cashbook_entries(is_deleted)`,
    `CREATE INDEX IF NOT EXISTS idx_cashbook_name       ON cashbook_entries(LOWER(name))`,
    `CREATE INDEX IF NOT EXISTS idx_cashbook_acc_no     ON cashbook_entries(acc_no)`,
    `DO $$ BEGIN CREATE TRIGGER trg_cashbook_updated_at BEFORE UPDATE ON cashbook_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 3. CUSTOMERS ──────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS customers (
    id             SERIAL PRIMARY KEY,
    customer_id    TEXT UNIQUE,
    name           TEXT,
    aadhar         TEXT,
    mobile         TEXT,
    pan            TEXT,
    dob            TEXT,
    address        TEXT,
    occupation     TEXT,
    saving_acc_no  TEXT,
    saving_balance NUMERIC     DEFAULT 0,
    share_acc_no   TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
  )`);
  for (const s of [
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_id    TEXT`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id)`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS pan            TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob            TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS address        TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS occupation     TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS saving_acc_no  TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS saving_balance NUMERIC DEFAULT 0`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS share_acc_no   TEXT`,
    `ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW()`,
    `CREATE INDEX IF NOT EXISTS idx_customers_aadhar ON customers(aadhar)`,
    `CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile)`,
    `CREATE INDEX IF NOT EXISTS idx_customers_name   ON customers(LOWER(name))`,
    `DO $$ BEGIN CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 4. GOLD_LOANS ─────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS gold_loans (
    id             SERIAL PRIMARY KEY,
    record_id      INTEGER REFERENCES records(id) ON DELETE CASCADE,
    loan_acc_no    TEXT,
    customer_name  TEXT,
    aadhar         TEXT,
    mobile         TEXT,
    loan_amount    NUMERIC     DEFAULT 0,
    loan_date      DATE,
    metal_type     TEXT,
    ornament_items JSONB       DEFAULT '[]',
    sonar_group_no TEXT,
    sonar_sub_no   TEXT,
    status         TEXT        DEFAULT 'active',
    closed_date    DATE,
    closed_remarks TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
  )`);
  for (const s of [
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS metal_type     TEXT`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS ornament_items JSONB DEFAULT '[]'`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS sonar_group_no TEXT`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS sonar_sub_no   TEXT`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS closed_remarks TEXT`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS closed_date    DATE`,
    `ALTER TABLE gold_loans ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW()`,
  ]) await run(s);
  await run(`ALTER TABLE gold_loans ALTER COLUMN loan_date DROP NOT NULL`);
  await run(cleanDate('gold_loans', 'loan_date'));
  await run(`ALTER TABLE gold_loans ALTER COLUMN loan_date TYPE date USING CASE WHEN loan_date IS NULL THEN NULL ELSE loan_date::text::date END`);
  await run(`ALTER TABLE gold_loans ALTER COLUMN closed_date DROP NOT NULL`);
  await run(cleanDate('gold_loans', 'closed_date'));
  await run(`ALTER TABLE gold_loans ALTER COLUMN closed_date TYPE date USING CASE WHEN closed_date IS NULL THEN NULL ELSE closed_date::text::date END`);
  for (const s of [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_gold_loans_record_id   ON gold_loans(record_id)`,
    `CREATE INDEX        IF NOT EXISTS idx_gold_loans_loan_acc_no ON gold_loans(loan_acc_no)`,
    `CREATE INDEX        IF NOT EXISTS idx_gold_loans_status      ON gold_loans(status)`,
    `DO $$ BEGIN CREATE TRIGGER trg_gold_loans_updated_at BEFORE UPDATE ON gold_loans FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 5. FD_ACCOUNTS ────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS fd_accounts (
    id                 SERIAL PRIMARY KEY,
    record_id          INTEGER REFERENCES records(id) ON DELETE CASCADE,
    fd_acc_no          TEXT,
    mis_acc_no         TEXT,
    fd_parvati_no      TEXT,
    customer_name      TEXT,
    aadhar             TEXT,
    mobile             TEXT,
    fd_amount          NUMERIC     DEFAULT 0,
    fd_period          INTEGER,
    fd_interest_rate   NUMERIC,
    fd_maturity_date   DATE,
    fd_maturity_amount NUMERIC,
    loan_date          DATE,
    status             TEXT        DEFAULT 'active',
    closed_date        DATE,
    section            TEXT        DEFAULT 'fd',
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
  )`);
  for (const s of [
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS mis_acc_no         TEXT`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS fd_parvati_no      TEXT`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS fd_period          INTEGER`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS fd_interest_rate   NUMERIC`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS fd_maturity_amount NUMERIC`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS section            TEXT DEFAULT 'fd'`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS closed_date        DATE`,
    `ALTER TABLE fd_accounts ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ DEFAULT NOW()`,
  ]) await run(s);
  await run(`ALTER TABLE fd_accounts ALTER COLUMN fd_maturity_date DROP NOT NULL`);
  await run(cleanDate('fd_accounts', 'fd_maturity_date'));
  await run(`ALTER TABLE fd_accounts ALTER COLUMN fd_maturity_date TYPE date USING CASE WHEN fd_maturity_date IS NULL THEN NULL ELSE fd_maturity_date::text::date END`);
  await run(`ALTER TABLE fd_accounts ALTER COLUMN loan_date DROP NOT NULL`);
  await run(cleanDate('fd_accounts', 'loan_date'));
  await run(`ALTER TABLE fd_accounts ALTER COLUMN loan_date TYPE date USING CASE WHEN loan_date IS NULL THEN NULL ELSE loan_date::text::date END`);
  await run(`ALTER TABLE fd_accounts ALTER COLUMN closed_date DROP NOT NULL`);
  await run(cleanDate('fd_accounts', 'closed_date'));
  await run(`ALTER TABLE fd_accounts ALTER COLUMN closed_date TYPE date USING CASE WHEN closed_date IS NULL THEN NULL ELSE closed_date::text::date END`);
  for (const s of [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_fd_accounts_record_id ON fd_accounts(record_id)`,
    `CREATE INDEX        IF NOT EXISTS idx_fd_accounts_fd_acc_no ON fd_accounts(fd_acc_no)`,
    `CREATE INDEX        IF NOT EXISTS idx_fd_accounts_status    ON fd_accounts(status)`,
    `DO $$ BEGIN CREATE TRIGGER trg_fd_accounts_updated_at BEFORE UPDATE ON fd_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 6. SAVING_ACCOUNTS ────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS saving_accounts (
    id            SERIAL PRIMARY KEY,
    record_id     INTEGER REFERENCES records(id) ON DELETE CASCADE,
    saving_acc_no TEXT,
    customer_name TEXT,
    aadhar        TEXT,
    mobile        TEXT,
    balance       NUMERIC     DEFAULT 0,
    status        TEXT        DEFAULT 'active',
    closed_date   DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  )`);
  await run(`ALTER TABLE saving_accounts ALTER COLUMN closed_date DROP NOT NULL`);
  await run(cleanDate('saving_accounts', 'closed_date'));
  await run(`ALTER TABLE saving_accounts ALTER COLUMN closed_date TYPE date USING CASE WHEN closed_date IS NULL THEN NULL ELSE closed_date::text::date END`);
  for (const s of [
    `CREATE INDEX IF NOT EXISTS idx_saving_accounts_acc_no ON saving_accounts(saving_acc_no)`,
    `CREATE INDEX IF NOT EXISTS idx_saving_accounts_aadhar ON saving_accounts(aadhar)`,
    `DO $$ BEGIN CREATE TRIGGER trg_saving_accounts_updated_at BEFORE UPDATE ON saving_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 7. OD_LOANS ───────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS od_loans (
    id               SERIAL PRIMARY KEY,
    record_id        INTEGER REFERENCES records(id) ON DELETE CASCADE,
    loan_acc_no      TEXT,
    fd_acc_no        TEXT,
    customer_name    TEXT,
    aadhar           TEXT,
    mobile           TEXT,
    loan_amount      NUMERIC     DEFAULT 0,
    fd_amount        NUMERIC     DEFAULT 0,
    fd_maturity_date DATE,
    loan_date        DATE,
    status           TEXT        DEFAULT 'active',
    closed_date      DATE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
  )`);
  await run(`ALTER TABLE od_loans ALTER COLUMN fd_maturity_date DROP NOT NULL`);
  await run(cleanDate('od_loans', 'fd_maturity_date'));
  await run(`ALTER TABLE od_loans ALTER COLUMN fd_maturity_date TYPE date USING CASE WHEN fd_maturity_date IS NULL THEN NULL ELSE fd_maturity_date::text::date END`);
  await run(`ALTER TABLE od_loans ALTER COLUMN loan_date DROP NOT NULL`);
  await run(cleanDate('od_loans', 'loan_date'));
  await run(`ALTER TABLE od_loans ALTER COLUMN loan_date TYPE date USING CASE WHEN loan_date IS NULL THEN NULL ELSE loan_date::text::date END`);
  await run(`ALTER TABLE od_loans ALTER COLUMN closed_date DROP NOT NULL`);
  await run(cleanDate('od_loans', 'closed_date'));
  await run(`ALTER TABLE od_loans ALTER COLUMN closed_date TYPE date USING CASE WHEN closed_date IS NULL THEN NULL ELSE closed_date::text::date END`);
  for (const s of [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_od_loans_record_id ON od_loans(record_id)`,
    `DO $$ BEGIN CREATE TRIGGER trg_od_loans_updated_at BEFORE UPDATE ON od_loans FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 8. MEMBERSHIPS ────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS memberships (
    id              SERIAL PRIMARY KEY,
    record_id       INTEGER REFERENCES records(id) ON DELETE CASCADE,
    customer_name   TEXT,
    aadhar          TEXT,
    mobile          TEXT,
    saving_acc_no   TEXT,
    share_acc_no    TEXT,
    membership_type TEXT,
    join_date       DATE,
    status          TEXT        DEFAULT 'active',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`);
  await run(`ALTER TABLE memberships ALTER COLUMN join_date DROP NOT NULL`);
  await run(cleanDate('memberships', 'join_date'));
  await run(`ALTER TABLE memberships ALTER COLUMN join_date TYPE date USING CASE WHEN join_date IS NULL THEN NULL ELSE join_date::text::date END`);
  for (const s of [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_memberships_record_id ON memberships(record_id)`,
    `DO $$ BEGIN CREATE TRIGGER trg_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ]) await run(s);

  // ── 9. SYNC_LOG ───────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS sync_log (
    id          SERIAL PRIMARY KEY,
    started_at  TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status      TEXT        DEFAULT 'running',
    message     TEXT,
    rows_synced INTEGER     DEFAULT 0
  )`);

  // ── 10. USERS ─────────────────────────────────────────────────────────
  await run(`CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    full_name  TEXT,
    role       TEXT        DEFAULT 'admin',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name  TEXT`);
  await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ`);

  console.log('✅ All migrations complete — tables ready');
}

module.exports = { runMigrations };
