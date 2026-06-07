import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const env = {...process.env, PORT:'34567'};
const child = spawn(process.execPath, ['src/server.mjs'], {cwd: new URL('..', import.meta.url), env, stdio:['ignore','pipe','pipe']});
await new Promise(resolve => child.stdout.once('data', resolve));
try {
  let r = await fetch('http://127.0.0.1:34567/health');
  let j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.status.version, '7.8.4');
  assert.equal(j.status.publicShowroomEnabled, true);
  assert.equal(j.status.hardwareControlAllowed, false);
  assert.equal(j.status.paymentAllowed, false);

  r = await fetch('http://127.0.0.1:34567/api/ava-readiness');
  j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.activation.hardwareControl, false);
  assert.equal(j.activation.payment, false);

  r = await fetch('http://127.0.0.1:34567/api/ava-chat', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({message:'hello'})});
  j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.answer.includes('Direct answer:'), true);

  r = await fetch('http://127.0.0.1:34567/api/ava-file', {method:'POST', headers:{'content-type':'application/json'}, body:'{}'});
  j = await r.json();
  assert.deepEqual(j.blocked, ['file_retrieval_disabled']);

  r = await fetch('http://127.0.0.1:34567/api/ava-device', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({query:'JVC projector'})});
  j = await r.json();
  assert.equal(j.mode, 'lookup_plan_only');
  assert.equal(j.fieldReady, false);

  r = await fetch('http://127.0.0.1:34567/api/ava-owner-verify', {method:'POST'});
  j = await r.json();
  assert.deepEqual(j.blocked, ['owner_token_required']);

  

  r = await fetch('http://127.0.0.1:34567/api/ava-fast-chat', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({message:'What does AV mean?'})});
  j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.route, 'fast_supervisor_runtime');
  assert.equal(j.intent, 'definition');

  r = await fetch('http://127.0.0.1:34567/api/ava-being-status');
  j = await r.json();
  assert.equal(j.being.name, 'Ava');
  assert.equal(j.being.publicPath, '/AV/AVA');

  r = await fetch('http://127.0.0.1:34567/api/ava-memory-status');
  j = await r.json();
  assert.equal(j.memory.publicMemoryWritesAllowed, false);

  r = await fetch('http://127.0.0.1:34567/api/ava-storage-status');
  j = await r.json();
  assert.equal(j.storage.rawCustomerFilePublicAccess, false);

  r = await fetch('http://127.0.0.1:34567/api/ava-computer', {method:'POST'});
  j = await r.json();
  assert.deepEqual(j.blocked, ['owner_token_required']);

  r = await fetch('http://127.0.0.1:34567/api/ava-intake', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({message:'I want a theater but my phone is 555-555-5555'})});
  j = await r.json();
  assert.equal(j.customerDataRetained, false);
  assert.equal(JSON.stringify(j).includes('555-555-5555'), false);

  r = await fetch('http://127.0.0.1:34567/api/ava-proposal', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({message:'premium theater'})});
  j = await r.json();
  assert.equal(j.proposal.ownerReviewRequired, true);

  r = await fetch('http://127.0.0.1:34567/api/ava-deploy-doctor');
  j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.doctor.version, '7.8.4');
  assert.equal(j.doctor.canonicalPublicPath, '/AV/AVA');
  assert.equal(j.doctor.packageStatus, 'live_deployment_execution_ready_not_live');

  console.log('Ava Railway v7.8.4 smoke tests passed.');
} finally {
  child.kill('SIGTERM');
}


// v7.8.4 teaching core static checks
import { readFileSync } from 'node:fs';
const serverSource = readFileSync(new URL('../src/server.mjs', import.meta.url), 'utf8');
if (!serverSource.includes('/api/ava-teaching-status') || !serverSource.includes('/api/ava-teach')) throw new Error('teaching routes missing');
const migrationSource = readFileSync(new URL('../migrations/001_ava_core_railway_postgres.sql', import.meta.url), 'utf8');
if (!migrationSource.includes('ava_teaching_lessons') || !migrationSource.includes('ava_verified_source_registry')) throw new Error('teaching tables missing');
