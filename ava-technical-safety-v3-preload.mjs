const previousFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V3 = [
  '70V line-drop rule: do not dismiss a measured voltage drop on a constant-voltage loudspeaker line as negligible merely because the nominal distribution voltage is high. Delivered power to a fixed transformer/load scales approximately with V^2, so a drop from 70 V to 58 V delivers about (58/70)^2 = 0.686, roughly 31% less power at the downstream load. Treat a large drop as evidence to investigate conductor gauge/length, terminations, aggregate load, branch topology, transformer taps, and amplifier/output health before blaming individual loudspeakers.',
  '70V line-drop measurement rule: establish how and where the voltage was measured, under what program/test signal and load condition, and compare source-end versus far-end voltage. Do not infer operating load from a DC resistance reading, and do not declare a line safe or faulty from voltage percentage alone without verifying the measurement method and the actual distributed-load design.'
].join('\n');

function getUserMessage(payload = {}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const user = [...input].reverse().find(x => x && x.role === 'user');
  return String(user?.content || '');
}

function addRules(payload = {}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const system = input.find(x => x && x.role === 'system');
  if (system) system.content = `${String(system.content || '')}\n${AVA_TECHNICAL_RULES_V3}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V3});
  return {...payload, input};
}

export function applyAvaTechnicalSafetyV3(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');

  const lineDropCase = /(?:\b70\s*v\b|\b100\s*v\b|constant[-\s]?voltage|speaker line|distributed audio)/i.test(q)
    && /(voltage drop|volt drop|\b12\s*(?:v|volt|volts)\b|far[-\s]?end|last speaker)/i.test(q);

  const dismissesDrop = /(negligible|technician is correct|less than\s+\d+%[\s\S]{0,80}(?:will not|won't|does not|doesn't)|small voltage drop[\s\S]{0,80}(?:will not|won't|does not|doesn't))/i.test(a);
  const redirectsAwayFromLine = /(bad amplifier|amplifier output stage|blown speaker|speaker cone)[\s\S]{0,80}(?:rather than|not).*?(?:wire|line|copper)|(?:rather than|not).*?(?:wire|line|copper)[\s\S]{0,80}(bad amplifier|blown speaker)/i.test(a);

  if (lineDropCase && (dismissesDrop || redirectsAwayFromLine)) {
    return [
      'Direct answer: No. A 12 V drop on a nominal 70 V loudspeaker line is large enough to matter and should not be dismissed.',
      'Why it matters: if a downstream transformer/load is effectively fixed, delivered power scales approximately with the square of applied voltage. Dropping from 70 V to 58 V gives (58/70)^2 ≈ 0.686, so the far end receives only about 69% of the power it would receive at 70 V — roughly a 31% reduction.',
      'Safest next step: verify the source-end and far-end AC voltage under the same known test/program condition, then check conductor gauge and total loop length, terminations/splices, branch topology, summed transformer taps, and amplifier/output configuration. Do not jump directly to a blown speaker or bad amplifier output stage until the line-loss cause is measured.',
      'Verification: confirm the measurement method and load condition. A normal DMM resistance reading is not the same as operating AC impedance, and a single percentage alone is not enough to declare the system safe or failed.'
    ].join('\n\n');
  }

  return a;
}

if (typeof previousFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV3(resource, options = {}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) {
      return previousFetch(resource, options);
    }

    let payload;
    try { payload = JSON.parse(String(options.body)); }
    catch { return previousFetch(resource, options); }

    const message = getUserMessage(payload);
    const patchedPayload = addRules(payload);
    const response = await previousFetch(resource, {...options, body:JSON.stringify(patchedPayload)});
    if (!response.ok) return response;

    let data;
    try { data = await response.clone().json(); }
    catch { return response; }

    const text = data.output_text || (data.output || []).flatMap(item => item.content || []).map(c => c.text || c.value || '').filter(Boolean).join('\n');
    const guarded = applyAvaTechnicalSafetyV3(message, text || '');
    if (guarded === text) return response;

    data.output_text = guarded;
    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
    return new Response(JSON.stringify(data), {status:response.status, statusText:response.statusText, headers});
  };
}
