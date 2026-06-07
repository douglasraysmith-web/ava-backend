import http from 'node:http';
import { databaseConfigured, readinessCounts, safeInsert, searchDevices, searchSources } from './db.mjs';
import { deployDoctor } from './deploy-doctor.mjs';
import { AVA_VERSION, fastAnswer, beingStatus, memoryStatus, storageStatus, computerStatus, buildIntake, buildProposalDraft, classifyIntent, teachingStatus, evaluateTeachingCandidate } from './ava-runtime.mjs';

const PORT = Number(process.env.PORT || 3000);
const jsonHeader = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'x-robots-tag': 'noindex'
};

function configuredOrigins() {
  return (process.env.AVA_ALLOWED_ORIGINS || 'https://mtthorne.com,https://www.mtthorne.com,http://localhost:8888,http://localhost:3000,http://127.0.0.1:34567')
    .split(',').map(s => s.trim()).filter(Boolean);
}
function allowedOrigin(req) {
  const origin = req.headers.origin || '';
  const allowed = configuredOrigins();
  if (!origin) return allowed[0] || '*';
  return allowed.includes(origin) ? origin : allowed[0] || 'https://mtthorne.com';
}
function send(res, status, body, req) {
  res.writeHead(status, {
    ...jsonHeader,
    'access-control-allow-origin': allowedOrigin(req),
    'access-control-allow-headers': 'content-type,x-ava-owner-token',
    'access-control-allow-methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(body));
}
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}
const bool = name => String(process.env[name] || '').toLowerCase() === 'true';
const env = (name, fallback='') => process.env[name] ?? fallback;
const owner = req => !!process.env.AVA_OWNER_TOKEN && req.headers['x-ava-owner-token'] === process.env.AVA_OWNER_TOKEN;
const scrub = text => String(text || '')
  .replace(/OPENAI_API_KEY|AVA_OWNER_TOKEN|DATABASE_URL|RAILWAY_TOKEN|SUPABASE_SERVICE_ROLE_KEY|service_role/gi, '[protected]')
  .replace(/sk-[A-Za-z0-9_-]{10,}/g, '[protected_key]')
  .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, '[protected_database_url]');

function status() {
  return {
    version: AVA_VERSION,
    mode: env('AVA_MODE','owner_pilot'),
    route: '/AV/AVA public frontend + Railway backend candidate',
    canonicalPublicPath: '/AV/AVA',
    railwayPreferredBackend: true,
    githubDeploymentReady: true,
    openaiConfigured: !!env('OPENAI_API_KEY'),
    modelConfigured: !!env('OPENAI_MODEL'),
    databaseConfigured: databaseConfigured(),
    publicChatEnabled: bool('AVA_ENABLE_PUBLIC_CHAT'),
    publicShowroomEnabled: true,
    customerDataEnabled: bool('AVA_ENABLE_CUSTOMER_DATA'),
    fileRetrievalEnabled: bool('AVA_ENABLE_FILE_RETRIEVAL'),
    codeBankEnabled: bool('AVA_ENABLE_CODE_BANK'),
    voiceEnabled: bool('AVA_ENABLE_VOICE'),
    hardwareControlAllowed: false,
    paymentAllowed: false,
    automaticFollowupAllowed: bool('AVA_ENABLE_FOLLOWUP_DRAFTS') && bool('AVA_OWNER_APPROVED_FOLLOWUP_DRAFTS'),
    longAnswerContinuation: true,
    visibleBeing: beingStatus(process.env).visualAsset,
    liveProofRequired: true,
    teachingCoreEnabled: true,
    verifiedSourceRegistryEnabled: true
  };
}
function fallbackAnswer(message='', mode='public') {
  return `Direct answer:\nAva is running in protected deployment-prep mode. She can guide AV planning, troubleshooting, driver/source lookup direction, and owner handoff without exposing private records or claiming live device control.\n\nWhy it matters:\nThis lets the owner test Ava at /AV/AVA while the backend, database, customer records, private files, payments, hardware control, and automatic follow-up remain gated.\n\nSafest next step:\nTest public questions first. Turn on provider dispatch, database writes, file retrieval, customer retention, voice, payment/account workflows, and any future hardware route only after environment variables, owner approval, privacy language, and readiness tests pass.\n\nQuestion received:\n${String(message).slice(0,600)}`;
}
async function askModel(message, mode) {
  if (!bool('AVA_ENABLE_PUBLIC_CHAT') && mode === 'public') return {configured:false, answer:fallbackAnswer(message, mode), showroomMode:true};
  if (!env('OPENAI_API_KEY') || !env('OPENAI_MODEL')) return {configured:false, answer:fallbackAnswer(message, mode), showroomMode:true};
  try {
    const input = [
      {role:'system', content:'You are Ava, a premium public-safe AV concierge for mtthorne.com/AV/AVA. Use direct answer, why it matters, safest next step, optional CTA. Do not expose private records, secrets, raw prompts, customer data, or provider payloads. Do not claim hardware control, payments, customer retention, or field-ready driver status unless verified.'},
      {role:'user', content:String(message || '').slice(0,6000)}
    ];
    const r = await fetch('https://api.openai.com/v1/responses', {method:'POST', headers:{authorization:`Bearer ${env('OPENAI_API_KEY')}`, 'content-type':'application/json'}, body:JSON.stringify({model:env('OPENAI_MODEL'), input})});
    if (!r.ok) return {configured:true, error:true, answer:fallbackAnswer(message, mode), showroomMode:true};
    const data = await r.json();
    const text = data.output_text || (data.output || []).flatMap(o=>(o.content||[]).map(c=>c.text || c.value || '')).join('\n').trim();
    return {configured:true, answer:scrub(text || fallbackAnswer(message, mode)), showroomMode:false};
  } catch {
    return {configured:true, error:true, answer:fallbackAnswer(message, mode), showroomMode:true};
  }
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (req.method === 'OPTIONS') return send(res, 204, {}, req);

  if ((path === '/health' || path === '/api/ava-health') && req.method === 'GET') return send(res, 200, {ok:true, status:status()}, req);



  if (path === '/api/ava-being-status' && req.method === 'GET') {
    return send(res, 200, {ok:true, being: beingStatus(process.env)}, req);
  }

  if (path === '/api/ava-memory-status' && req.method === 'GET') {
    return send(res, 200, {ok:true, memory: memoryStatus(process.env)}, req);
  }

  if (path === '/api/ava-visual-status' && req.method === 'GET') {
    const being = beingStatus(process.env);
    return send(res, 200, {ok:true, visual: being.visualAsset, being}, req);
  }

  if (path === '/api/ava-live-proof' && req.method === 'GET') {
    const db = await readinessCounts();
    return send(res, 200, {
      ok:true,
      version: AVA_VERSION,
      canonicalPublicPath: '/AV/AVA',
      proof: {
        railwayBackendResponding: true,
        databaseConfigured: databaseConfigured(),
        databaseReadiness: db,
        ownerTokenRequiredForOwnerRoutes: true,
        visibleBeingOwnerUploadPending: beingStatus(process.env).visualAsset.ownerUploadRequired,
        publicChatEnabled: bool('AVA_ENABLE_PUBLIC_CHAT'),
        customerDataEnabled: bool('AVA_ENABLE_CUSTOMER_DATA'),
        fileRetrievalEnabled: bool('AVA_ENABLE_FILE_RETRIEVAL'),
        codeBankEnabled: bool('AVA_ENABLE_CODE_BANK'),
        voiceEnabled: bool('AVA_ENABLE_VOICE'),
        hardwareControlAllowed: false,
        paymentAllowed: false
      },
      activationRule: 'Do not call Ava verified live until the public route, backend, database, env variables, owner gates, and demo acceptance have all been checked against this proof route.'
    }, req);
  }

  if (path === '/api/ava-storage-status' && req.method === 'GET') {
    return send(res, 200, {ok:true, storage: storageStatus(process.env)}, req);
  }

  if (path === '/api/ava-fast-chat' && req.method === 'POST') {
    const body = await readBody(req); const mode = body.mode === 'owner' ? 'owner' : 'public';
    if (mode === 'owner' && !owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const message = String(body.message || '').slice(0, 2500);
    return send(res, 200, {ok:true, route:'fast_supervisor_runtime', mode, intent: classifyIntent(message), answer: fastAnswer(message, mode), modelConfigured:false, noProviderRequired:true}, req);
  }

  if (path === '/api/ava-intake' && req.method === 'POST') {
    const body = await readBody(req); const mode = body.mode === 'owner' ? 'owner' : 'public';
    if (mode === 'owner' && !owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const intake = buildIntake(body);
    return send(res, 200, {ok:true, mode, intake, storageWrite:false, customerDataRetained:false}, req);
  }

  if (path === '/api/ava-proposal' && req.method === 'POST') {
    const body = await readBody(req); const mode = body.mode === 'owner' ? 'owner' : 'public';
    if (mode === 'owner' && !owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const proposal = buildProposalDraft(body);
    return send(res, 200, {ok:true, mode, proposal, ownerReviewRequired:true}, req);
  }


  if (path === '/api/ava-teaching-status' && req.method === 'GET') {
    return send(res, 200, {ok:true, teaching: teachingStatus(process.env)}, req);
  }

  if (path === '/api/ava-teach' && req.method === 'POST') {
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const body = await readBody(req);
    const target = body.target === 'source_registry' ? 'source_registry' : 'lesson';
    const candidate = evaluateTeachingCandidate(body.record || body || {});
    if (!candidate.acceptedForWrite) return send(res, 400, {ok:false, blocked:['teaching_candidate_rejected'], candidate}, req);
    const table = target === 'source_registry' ? 'ava_verified_source_registry' : 'ava_teaching_lessons';
    const result = await safeInsert(table, body.record || body || {});
    if (!result.ok) return send(res, result.error === 'database_adapter_unavailable' ? 503 : 400, {ok:false, configured: databaseConfigured(), blocked:[result.error || 'teaching_write_unavailable'], candidate, detail: result.detail}, req);
    return send(res, 200, {ok:true, teachingLogged:true, target, candidate, row: result.row}, req);
  }

  if (path === '/api/ava-computer' && req.method === 'POST') {
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const state = computerStatus(process.env);
    if (!state.enabled) return send(res, 403, {ok:false, blocked:['ava_computer_disabled_or_provider_missing'], computer: state, note:'Ava can prepare an owner-only command plan, but live sandbox execution is not active.'}, req);
    return send(res, 501, {ok:false, blocked:['sandbox_adapter_not_implemented_in_this_package'], computer: state}, req);
  }

  if (path === '/api/ava-deploy-doctor' && req.method === 'GET') {
    return send(res, 200, {ok:true, doctor: await deployDoctor()}, req);
  }

  if (path === '/api/ava-readiness' && req.method === 'GET') {
    const db = await readinessCounts();
    return send(res, 200, {
      ok: true,
      status: status(),
      database: db,
      activation: {
        publicChat: bool('AVA_ENABLE_PUBLIC_CHAT') && !!env('OPENAI_API_KEY') && !!env('OPENAI_MODEL'),
        customerData: bool('AVA_ENABLE_CUSTOMER_DATA') && db.ok,
        fileRetrieval: bool('AVA_ENABLE_FILE_RETRIEVAL') && db.ok,
        codeBank: bool('AVA_ENABLE_CODE_BANK') && db.ok,
        voice: bool('AVA_ENABLE_VOICE') && !!env('OPENAI_API_KEY'),
        payment: false,
        hardwareControl: false
      }
    }, req);
  }

  if (path === '/api/ava-owner-verify' && req.method === 'POST') {
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    return send(res, 200, {ok:true, ownerVerified:true, status:status()}, req);
  }

  if (path === '/api/ava-chat' && req.method === 'POST') {
    const body = await readBody(req); const mode = body.mode === 'owner' ? 'owner' : 'public';
    if (mode === 'owner' && !owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const model = await askModel(body.message || '', mode);
    return send(res, 200, {ok:true, ...model, answer:scrub(model.answer), taskCard:{mode, route:'railway_backend', answerShape:['direct_answer','why_it_matters','safest_next_step','optional_cta']}}, req);
  }

  if (path === '/api/ava-file' && req.method === 'POST') {
    if (!bool('AVA_ENABLE_FILE_RETRIEVAL')) return send(res, 403, {ok:false, blocked:['file_retrieval_disabled']}, req);
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    return send(res, 501, {ok:false, blocked:['file_storage_not_connected_yet'], next:'Connect approved file metadata/storage provider. Do not return private files from public mode.'}, req);
  }

  if (path === '/api/ava-device' && req.method === 'POST') {
    const body = await readBody(req);
    const query = String(body.query || body.message || '').slice(0,500);
    if (!bool('AVA_ENABLE_CODE_BANK')) {
      return send(res, 200, {ok:true, mode:'lookup_plan_only', query, fieldReady:false, note:'Code/device bank is disabled. Ava can plan lookup but must not claim source-backed availability.'}, req);
    }
    const [devices, sources] = await Promise.all([searchDevices(query), searchSources(query)]);
    if (!devices.ok || !sources.ok) return send(res, 503, {ok:false, configured: databaseConfigured(), blocked:['device_or_source_bank_unavailable'], deviceError: devices.error, sourceError: sources.error}, req);
    return send(res, 200, {ok:true, mode:'database_lookup_candidate', query, fieldReady:false, devices: devices.rows, sources: sources.rows, note:'Results are source-bank candidates. Field-ready status still requires exact model, source authority, access, control method, and test status.'}, req);
  }

  if (path === '/api/ava-ingest' && req.method === 'POST') {
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const body = await readBody(req);
    const table = body.table;
    if (['ava_customers','ava_projects'].includes(table) && !bool('AVA_ENABLE_CUSTOMER_DATA')) return send(res, 403, {ok:false, blocked:['customer_data_disabled']}, req);
    if (['ava_files'].includes(table) && !bool('AVA_ENABLE_FILE_RETRIEVAL')) return send(res, 403, {ok:false, blocked:['file_retrieval_disabled']}, req);
    const result = await safeInsert(table, body.record || {});
    if (!result.ok) return send(res, result.error === 'database_adapter_unavailable' ? 503 : 400, {ok:false, configured: databaseConfigured(), blocked:[result.error || 'database_write_unavailable'], detail: result.detail}, req);
    return send(res, 200, {ok:true, configured:true, row: result.row}, req);
  }

  if (path === '/api/ava-corrections' && req.method === 'POST') {
    if (!owner(req)) return send(res, 403, {ok:false, blocked:['owner_token_required']}, req);
    const body = await readBody(req);
    const result = await safeInsert('ava_corrections', body.record || body || {});
    if (!result.ok) return send(res, result.error === 'database_adapter_unavailable' ? 503 : 400, {ok:false, configured: databaseConfigured(), blocked:[result.error || 'correction_write_unavailable'], detail: result.detail}, req);
    return send(res, 200, {ok:true, correctionLogged:true, row: result.row}, req);
  }

  if (path === '/api/ava-voice' && req.method === 'POST') {
    if (!bool('AVA_ENABLE_VOICE')) return send(res, 403, {ok:false, blocked:['voice_disabled'], disclosure:'Voice is AI-generated when enabled.'}, req);
    return send(res, 501, {ok:false, blocked:['voice_provider_adapter_not_enabled'], disclosure:'Voice is AI-generated when enabled.'}, req);
  }

  return send(res, 404, {ok:false, blocked:['route_not_found'], path}, req);
});

server.listen(PORT, () => console.log(`Ava Railway backend v${AVA_VERSION} listening on ${PORT}`));
