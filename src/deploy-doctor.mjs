import { readinessCounts } from './db.mjs';

const bool = name => String(process.env[name] || '').toLowerCase() === 'true';
const has = name => !!String(process.env[name] || '').trim();

export async function deployDoctor() {
  const db = await readinessCounts();
  const checks = [
    {id:'railway_port', ok: has('PORT'), severity:'info', why:'Railway normally injects PORT; local smoke tests also set it.'},
    {id:'database_url', ok: has('DATABASE_URL'), severity:'required_for_memory', why:'Needed before customer/project/device/source banks can persist.'},
    {id:'database_migrated', ok: !!db.ok, severity:'required_for_banks', why:'Migration must create Ava tables before data-bank features are enabled.', detail: db},
    {id:'owner_token', ok: has('AVA_OWNER_TOKEN'), severity:'required_for_owner_routes', why:'Protects owner-only ingest, verification, and correction routes.'},
    {id:'public_chat_gate_safe', ok: !bool('AVA_ENABLE_PUBLIC_CHAT') || (has('OPENAI_API_KEY') && has('OPENAI_MODEL')), severity:'required_before_public_ai', why:'Public AI route should only activate when a model provider is configured.'},
    {id:'customer_data_gate_safe', ok: !bool('AVA_ENABLE_CUSTOMER_DATA') || db.ok, severity:'required_before_customer_data', why:'Customer records cannot turn on without a migrated database.'},
    {id:'file_retrieval_gate_safe', ok: !bool('AVA_ENABLE_FILE_RETRIEVAL') || db.ok, severity:'required_before_files', why:'File retrieval requires an approved storage/metadata path.'},
    {id:'code_bank_gate_safe', ok: !bool('AVA_ENABLE_CODE_BANK') || db.ok, severity:'required_before_code_bank', why:'Device/code lookups require verified database tables.'},
    {id:'voice_gate_safe', ok: !bool('AVA_ENABLE_VOICE') || has('OPENAI_API_KEY'), severity:'required_before_voice', why:'Voice must not enable without a provider adapter and disclosure.'},
    {id:'hardware_control_blocked', ok: !bool('AVA_ALLOW_HARDWARE_CONTROL'), severity:'must_remain_blocked', why:'No live hardware control in owner pilot.'},
    {id:'payment_blocked', ok: !bool('AVA_ALLOW_PAYMENT'), severity:'must_remain_blocked', why:'No payment/account workflow until owner-approved payment system exists.'}
  ];
  const failed = checks.filter(c => !c.ok);
  return {
    version: '7.8.4',
    canonicalPublicPath: '/AV/AVA',
    packageStatus: 'live_deployment_execution_ready_not_live',
    goLiveSafe: failed.length === 0,
    failed,
    checks,
    nextHumanActions: [
      'Commit package to GitHub repository.',
      'Connect Railway service to GitHub repo with root directory railway/.',
      'Create Railway Postgres and set DATABASE_URL.',
      'Set AVA_OWNER_TOKEN and other safe environment variables.',
      'Run railway/scripts/apply-migration.mjs once DATABASE_URL is configured.',
      'Open /api/ava-readiness and /api/ava-deploy-doctor on the Railway service.',
      'Point mtthorne.com/AV/AVA frontend config to the verified backend only after owner review.'
    ]
  };
}
