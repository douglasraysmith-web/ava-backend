let cachedPool = null;

export function databaseConfigured() {
  return !!process.env.DATABASE_URL;
}

export async function getPool() {
  if (!databaseConfigured()) return null;
  if (cachedPool) return cachedPool;
  try {
    const { Pool } = await import('pg');
    cachedPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: String(process.env.PGSSLMODE || '').toLowerCase() === 'disable' ? false : { rejectUnauthorized: false },
      max: Number(process.env.AVA_DB_POOL_MAX || 4),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 4_000
    });
    return cachedPool;
  } catch (error) {
    return null;
  }
}

export async function dbQuery(text, values = []) {
  const pool = await getPool();
  if (!pool) return { ok: false, configured: databaseConfigured(), error: 'database_adapter_unavailable', rows: [], rowCount: 0 };
  try {
    const result = await pool.query(text, values);
    return { ok: true, configured: true, rows: result.rows || [], rowCount: result.rowCount || 0 };
  } catch (error) {
    return { ok: false, configured: true, error: 'database_query_failed', detail: error?.code || error?.message || 'unknown', rows: [], rowCount: 0 };
  }
}

const tableMap = {
  ava_corrections: ['visible_failure','likely_cause','repair','verification_check','do_not_repeat_rule','carryforward_rule','status','metadata'],
  ava_sources: ['source_name','source_url','source_type','manufacturer','model_or_series','platform','device_category','authority_level','access_requirement','lifecycle_state','last_verified_date','notes','metadata'],
  ava_files: ['title','file_kind','storage_path','source_id','project_id','access_scope','lifecycle_state','checksum_sha256','notes','metadata'],
  ava_devices: ['project_id','room_id','manufacturer','model','series','device_category','target_platform','role_in_system','connection_methods','verification_state','metadata'],
  ava_projects: ['customer_id','project_name','project_type','status','privacy_class','notes_private','metadata'],
  ava_customers: ['display_name','company_name','email','phone','consent_status','notes_private','metadata'],
  ava_teaching_lessons: ['lesson_key','lesson_title','lesson_category','source_authority','rights_status','public_safe_use','owner_only_notes','lifecycle_state','verification_date','lesson_body','metadata'],
  ava_verified_source_registry: ['source_name','official_location','source_category','material_type','rights_status','reuse_restrictions','verification_date','public_safe_use','owner_only_notes','lifecycle_state','metadata']
};

export function allowedColumns(table) {
  return tableMap[table] || [];
}

export async function safeInsert(table, record = {}) {
  const cols = allowedColumns(table);
  if (!cols.length) return { ok: false, error: 'table_not_allowed' };
  const clean = {};
  for (const col of cols) {
    if (Object.prototype.hasOwnProperty.call(record, col)) clean[col] = record[col];
  }
  if (!Object.keys(clean).length) return { ok: false, error: 'no_allowed_fields' };
  const names = Object.keys(clean);
  const placeholders = names.map((_, i) => `$${i+1}`).join(', ');
  const sql = `insert into ${table} (${names.join(', ')}) values (${placeholders}) returning *`;
  const result = await dbQuery(sql, Object.values(clean));
  return result.ok ? { ...result, row: result.rows[0] || null } : result;
}

export async function searchDevices(query = '') {
  const q = `%${String(query || '').slice(0, 120)}%`;
  return dbQuery(`
    select id, manufacturer, model, series, device_category, target_platform, verification_state, role_in_system
    from ava_devices
    where coalesce(manufacturer,'') ilike $1
       or coalesce(model,'') ilike $1
       or coalesce(series,'') ilike $1
       or coalesce(device_category,'') ilike $1
    order by created_at desc
    limit 12
  `, [q]);
}

export async function searchSources(query = '') {
  const q = `%${String(query || '').slice(0, 120)}%`;
  return dbQuery(`
    select id, source_name, source_type, manufacturer, model_or_series, platform, device_category, authority_level, access_requirement, lifecycle_state, last_verified_date, notes
    from ava_sources
    where lifecycle_state in ('active','approved','source_verified','model_matched','proposed')
      and (coalesce(source_name,'') ilike $1
        or coalesce(manufacturer,'') ilike $1
        or coalesce(model_or_series,'') ilike $1
        or coalesce(platform,'') ilike $1
        or coalesce(device_category,'') ilike $1)
    order by last_verified_date desc nulls last, created_at desc
    limit 12
  `, [q]);
}

export async function readinessCounts() {
  if (!databaseConfigured()) return { ok: false, configured: false, error: 'database_url_missing' };
  const tables = ['ava_customers','ava_projects','ava_devices','ava_sources','ava_files','ava_corrections','ava_audit_events','ava_teaching_lessons','ava_verified_source_registry'];
  const counts = {};
  for (const table of tables) {
    const result = await dbQuery(`select count(*)::int as count from ${table}`);
    if (!result.ok) return { ok:false, configured:true, error:'migration_not_verified', failedTable: table, detail: result.detail || result.error };
    counts[table] = result.rows[0]?.count ?? 0;
  }
  return { ok:true, configured:true, counts };
}
