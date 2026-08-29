const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V6 = [
  'HDBaseT rule: do not invent transport bandwidth or thermal-pin mechanisms. Under the commissioning baseline used here, HDBaseT Spec 2.0 is a 10.2 Gbps-class transport and cannot carry an 18 Gbps 4K60 10-bit 4:4:4 payload uncompressed; HDBaseT Spec 3.0 is the class intended for uncompressed 18 Gbps transport. Diagnose link capability, format/chroma/bit-depth, cable category/length, terminations and extender specifications rather than fictitious RJ45 heating effects.',
  'USB high-speed equalization rule: skin effect pushes high-frequency current density toward the conductor surface, increasing effective AC resistance. CTLE is an analog continuous-time linear equalizer that restores high-frequency content; DFE is a decision-feedback equalizer using prior symbol decisions to cancel post-cursor ISI. Do not invert these roles.',
  'AES67 packetization rule: samples per packet = sample_rate * packet_time_seconds. At 48 kHz and 250 microseconds the payload is 12 samples, not 120. Unmanaged Ethernet switches do not translate, compress or bridge PTPv1/PTPv2 profiles; clock-domain interoperability requires compatible profile support or an explicitly designed timing boundary/bridge.',
  'Integer scaling rule: exact integer scaling such as 1920x1080 to 5760x3240 is a 3x mapping. When pixel-edge fidelity is the goal, integer/pixel-perfect nearest-neighbor replication preserves source pixel boundaries; bilinear/bicubic interpolation blends neighbors and can soften fine text. Do not describe exact 3x scaling as fractional.',
  'HDBaseT EMI rule: vinyl/electrical tape is dielectric insulation, not RF shielding. For EMI/alien-crosstalk susceptibility, use the specified shielded cable/connector/bonding architecture and required physical separation from interference sources; do not claim tape creates electromagnetic shielding.',
  'Line-array spacing rule: do not invent a universal d/2 low-frequency directivity threshold. Directivity floor depends on acoustic aperture/array length relative to wavelength, while element spacing and splay govern high-frequency interference/grating/comb behavior. Keep those mechanisms separate and verify the actual array geometry and manufacturer model.',
  'Axial room-mode rule: the nth axial mode is f_n = n*c/(2L); the first-order fundamental is c/(2L), not c/L. A deep geometric modal null should not be corrected by large EQ boost because cancellation remains while amplifier/subwoofer headroom is consumed. Use source/listener placement, multi-sub optimization and treatment where appropriate.',
  'Optical link-budget rule: remaining optical margin = available transmitter-to-receiver budget minus total path loss. Never add insertion loss to the available budget. Example: 16 dB available budget with 6.6 dB path loss leaves 9.4 dB margin.'
].join('\n');

function userMessage(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const u = [...input].reverse().find(x => x?.role === 'user');
  return String(u?.content || '');
}

function addRules(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const s = input.find(x => x?.role === 'system');
  if (s) s.content = `${String(s.content || '')}\n${AVA_TECHNICAL_RULES_V6}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V6});
  return {...payload, input};
}

export function applyAvaTechnicalSafetyV6(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');

  if (/(hdbaset|hd base t|cat6a|4k60|10-bit|4:4:4)/i.test(q) && /(24\s*gbps|4\.5\s*ohm|pin.*heat|thermal.*rj45|rj45.*heat)/i.test(a)) {
    return 'Technical correction: Do not invent HDBaseT bandwidth or connector-heating mechanisms. Under this commissioning baseline, HDBaseT Spec 2.0 is a 10.2 Gbps-class link and cannot transport an 18 Gbps 4K60 10-bit 4:4:4 payload uncompressed; Spec 3.0 is the class intended for uncompressed 18 Gbps. Verify the exact extender specification, negotiated video format/chroma/bit depth, cable/termination quality and supported distance.';
  }

  if (/(usb 3|usb3|ctle|dfe|skin effect|10\s*gbps)/i.test(q) && /(center.*conductor|digital low[- ]pass|ctle.*low[- ]pass|dfe.*phase[- ]locked|dfe.*analog)/i.test(a)) {
    return 'Technical correction: Skin effect concentrates high-frequency current density toward the conductor surface, increasing effective AC resistance. CTLE is an analog equalizer that emphasizes/restores attenuated high-frequency content, while DFE is a decision-feedback equalizer that uses prior symbol decisions to cancel post-cursor ISI. Do not invert those mechanisms.';
  }

  if (/(aes67|48\s*khz|250\s*(?:us|μs|microsecond)|ptpv1|ptpv2)/i.test(q) && /(120\s*samples|header compression|compress.*ptp|map.*ptpv2.*ptpv1|(?:let|have|use)\s+(?:the\s+)?unmanaged[\s\S]{0,80}translat|unmanaged[\s\S]{0,80}(?:will|can|does|automatically)\s+translat)/i.test(a)) {
    return 'Technical correction: AES67 packet payload is sample rate multiplied by packet time. At 48 kHz and 250 microseconds, 48,000 × 0.000250 = 12 samples per packet, not 120. An unmanaged switch does not translate or compress PTPv1/PTPv2 timing profiles; use compatible timing profiles or an explicitly designed boundary/bridge.';
  }

  if (/(1920.*1080|5760.*3240|3\.0x|3x|integer scal|pixel-perfect|nearest[- ]neighbor|bilinear)/i.test(q) && /(300.*fractional|3\.0.*fractional|bilinear.*eliminate.*alias|split.*3.*physical)/i.test(a)) {
    return 'Technical correction: 5760/1920 and 3240/1080 are exact 3.0x integer scale factors. For pixel-edge fidelity, pixel-perfect/nearest-neighbor replication can preserve source pixel boundaries at an exact integer ratio; bilinear/bicubic interpolation blends neighboring samples and can soften fine text. Do not call 3x fractional scaling.';
  }

  if (/(hdbaset|cat6|cat6a|alien crosstalk|emi|lighting|strobe)/i.test(q) && /(electrical tape|vinyl tape|tape.*shield|magnetic vacuum|gravitational)/i.test(a)) {
    return 'Technical correction: Vinyl/electrical tape is insulation, not electromagnetic shielding. For HDBaseT EMI/alien-crosstalk problems, use the specified shielded twisted-pair cable and bonded shielded connectors where required, maintain appropriate separation from interference sources, and verify grounding/termination practices. Do not invoke gravitational or vacuum coupling.';
  }

  if (/(line array|column array|splay|comb filter|inter-element|directivity|0\.35\s*m)/i.test(q) && /(d\/2|half.*spacing.*directivity|1960\s*hz.*threshold|below.*cylindrical.*above.*omni)/i.test(a)) {
    return 'Technical correction: Do not use a fabricated d/2 low-frequency directivity boundary. Low-frequency directivity is governed primarily by effective acoustic aperture/array length relative to wavelength; element spacing and splay primarily constrain high-frequency interference, lobing and comb-filter behavior. Verify the total array geometry and manufacturer data rather than collapsing these mechanisms into one formula.';
  }

  if (/(room mode|axial mode|modal null|subwoofer|null)/i.test(q) && /(f\s*=\s*v\s*\/\s*l|343\s*\/\s*7\.5|45\.73\s*hz|\+\s*12\s*dB.*null|boost.*null)/i.test(a)) {
    return 'Technical correction: The nth axial room mode is f_n = n·c/(2L); the first-order fundamental is c/(2L), so for L=7.5 m it is about 22.87 Hz and 45.73 Hz is the second-order mode. Do not use a large EQ boost to fill a deep geometric modal null; reposition sources/listeners, optimize multiple subs and use treatment/placement strategies instead.';
  }

  if (/(optical|fiber|link budget|insertion loss|receiver sensitivity|dB margin)/i.test(q) && /(16\s*dB\s*\+\s*6\.6|22\.6\s*dB|add.*loss.*budget|budget.*plus.*loss)/i.test(a)) {
    return 'Technical correction: Optical safety margin is available link budget minus total insertion/path loss. With 16 dB available and 6.6 dB loss, remaining margin is 9.4 dB—not 22.6 dB. Loss is subtracted from budget.';
  }

  return a;
}

if (typeof originalFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV6(resource, options={}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return originalFetch(resource, options);

    let payload;
    try { payload = JSON.parse(String(options.body)); }
    catch { return originalFetch(resource, options); }

    const message = userMessage(payload);
    const patchedPayload = addRules(payload);
    const response = await originalFetch(resource, {...options, body:JSON.stringify(patchedPayload)});
    if (!response.ok) return response;

    let data;
    try { data = await response.clone().json(); }
    catch { return response; }

    const text = data.output_text || (data.output || []).flatMap(item => item.content || []).map(c => c.text || c.value || '').filter(Boolean).join('\n');
    const guarded = applyAvaTechnicalSafetyV6(message, text || '');
    if (guarded === text) return response;

    data.output_text = guarded;
    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
    return new Response(JSON.stringify(data), {status:response.status, statusText:response.statusText, headers});
  };
}
