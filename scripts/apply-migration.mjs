import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Create Railway Postgres and attach/set DATABASE_URL before running migration.');
  process.exit(2);
}

const here = dirname(fileURLToPath(import.meta.url));
const sqlPath = resolve(here, '../migrations/001_ava_core_railway_postgres.sql');
const sql = readFileSync(sqlPath, 'utf8');
const { Client } = await import('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: String(process.env.PGSSLMODE || '').toLowerCase() === 'disable' ? false : { rejectUnauthorized: false }
});
try {
  await client.connect();
  await client.query(sql);
  const result = await client.query("select table_name from information_schema.tables where table_schema='public' and table_name like 'ava_%' order by table_name");
  console.log(JSON.stringify({ok:true, migratedTables: result.rows.map(r => r.table_name)}, null, 2));
} catch (error) {
  console.error(JSON.stringify({ok:false, error: error.message, code: error.code || null}, null, 2));
  process.exit(1);
} finally {
  await client.end().catch(()=>{});
}
