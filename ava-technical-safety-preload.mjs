const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V2 = [
  'Fiber-distance rule: never state a multimode fiber distance limit from fiber category alone. Tie the limit to the actual Ethernet/transport standard, data rate, optics/transceiver type, wavelength, and link budget. Example: OM3 may be about 300 m for 10GBASE-SR but can reach about 550 m for 1000BASE-SX with supported optics; diagnose the actual link before blaming length.',
  'Video-conversion rule: a format limit does not prove a frame-drop mechanism. A working 4K-to-1080p hardware down-converter should normally output a continuous supported raster/frame rate. For choppy USB-conference capture, trace converter output, capture-device capability, negotiated USB 3.x vs USB 2.0 mode, cabling/hubs, compression mode, host bandwidth, and application frame rate before replacing the SDI converter.',
  '70V impedance rule: distinguish DC resistance from AC impedance/load. A standard digital multimeter reading on a transformer-coupled 70V/100V speaker line is DC resistance and must not be inserted into P = V^2/R to calculate operating wattage. Use transformer-tap totals and the manufacturer-approved AC impedance/load method or an impedance meter/bridge at an appropriate test frequency. A true conductor short trends toward near-zero resistance, but low DCR alone on a transformer-coupled line does not prove either a short or an operating wattage.',
  '70V equivalent-load rule: only when the measured value is a valid AC equivalent impedance/load may V^2/Z be used as an approximation. For example, 12.5 ohms as a valid 70V AC equivalent load is about 392 W; do not apply that calculation to an ordinary DMM DC-resistance reading.',
  'Local speech reinforcement rule: in council/boardroom seating, do not route a nearby neighbor microphone into the overhead loudspeaker above adjacent listeners as the default fix for poor adjacent-seat audibility. First check natural acoustic path, furniture/sightline obstruction, microphone placement, automixer/gating threshold, gain structure, and zone/mix-minus logic; avoid creating a local acoustic feedback loop.'
].join('\n');

function getUserMessage(payload = {}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const user = [...input].reverse().find(x => x && x.role === 'user');
  return String(user?.content || '');
}

function addRulesToPayload(payload = {}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const system = input.find(x => x && x.role === 'system');
  if (system) system.content = `${String(system.content || '')}\n${AVA_TECHNICAL_RULES_V2}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V2});
  return {...payload, input};
}

export function applyAvaTechnicalSafetyV2(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');

  const distributedAudio = /(?:\b70\s*v\b|\b100\s*v\b|constant[-\s]?voltage|distributed audio|speaker line)/i.test(q);
  const protectionFault = /(shutdown|shut down|shutting down|protection|protect mode|trip|overheat|overload|fault|red fault|short)/i.test(q);
  const powerUpgrade = /(larger|bigger|higher[-\s]?power|more powerful|750\s*w|upgrade)[\s\S]{0,100}(amp|amplifier)|(amp|amplifier)[\s\S]{0,100}(larger|bigger|higher[-\s]?power|more powerful|750\s*w|upgrade)/i.test(a);

  if (distributedAudio && protectionFault && powerUpgrade) {
    return [
      'Direct answer: Do not increase amplifier power while the shutdown/protection condition is unresolved.',
      'Why it matters: in a 70V/100V system, normal cable resistance causes voltage drop and less delivered loudspeaker power; it does not create extra transformer-tap wattage that is cured by a larger amplifier. A protection event can come from excessive aggregate tap load, a short/ground fault, incorrect transformer wiring, damaged cable or loudspeaker transformer, overheating, or output/configuration faults.',
      'Safest next step: verify the amplifier model/output mode and rating, sum the transformer taps with required headroom, inspect wiring, and isolate branches/loads methodically before considering amplifier replacement or increased power.',
      'Verification: do not energize or upsize into an unresolved fault. Use qualified field/electrical help where the work scope requires it.'
    ].join('\n\n');
  }

  const fiberCase = /(om3|multimode|fiber|1000base-sx|10gbase-sr|dante|ptp)/i.test(q);
  const absolute300 = /(absolute maximum|cannot exceed|limited to|maximum)[\s\S]{0,60}300\s*(m|meter)/i.test(a) && !/(10gbase|10\s*gb|10-gig|10 gig)/i.test(a);
  if (fiberCase && absolute300) {
    return `${a}\n\nTechnical correction: Do not apply a 300 m OM3 limit without tying it to the active Ethernet/optical standard. OM3 reach depends on data rate and optics; for example, 10GBASE-SR is commonly about 300 m while 1000BASE-SX can support substantially longer runs (commonly up to about 550 m with supported optics). Verify the actual transceivers, negotiated/link standard, optical power/cleanliness, bend radius, patching, and switch/PTP configuration before blaming distance.`;
  }

  const videoCase = /(3g-sdi|12g-sdi|cross-converter|down-convert|capture|teams|usb)/i.test(q);
  const claimsFrameDropping = /(drop(?:s|ping)?[\s\S]{0,45}frames?|3\s+out\s+of\s+every\s+4\s+frames?|slideshow)/i.test(a) && /(3g-sdi|converter|cross-converter|down-sampl|down-convert)/i.test(a);
  if (videoCase && claimsFrameDropping) {
    return `${a}\n\nTechnical correction: A properly functioning hardware down-converter does not normally create a slideshow merely because the input is 4K and the output path is 1080p. Verify the converter's supported conversion mode, then trace the USB capture path: capture-device limits, negotiated USB 3.x versus USB 2.0 mode, cable/hub quality, compression format, host bandwidth, and Teams/application frame-rate reporting before replacing the SDI converter.`;
  }

  const dmmDcCase = distributedAudio && /(multimeter|digital multimeter|\bdmm\b|dc resistance|resistance reading)/i.test(q);
  const dmmUsedForWatts = /(v\s*[²^2]\s*\/\s*r|ohm'?s law|4900\s*\/|will draw|draws?|watt|watts)/i.test(a);
  if (dmmDcCase && dmmUsedForWatts) {
    return [
      'Direct answer: Do not calculate 70V operating wattage from that ordinary multimeter resistance reading.',
      'Why it matters: a standard DMM measures DC resistance. A transformer-coupled 70V/100V loudspeaker line presents a frequency-dependent AC impedance/load in operation, so its DC resistance can be much lower and is not the value to insert into P = V²/R for operating wattage.',
      'Safest next step: verify the intended transformer tap total, amplifier rating/output mode, and line wiring. If an electrical load measurement is required, use the manufacturer-approved distributed-line test method or an appropriate impedance meter/bridge at the specified test frequency. Investigate a suspected short separately rather than inferring it from wattage calculated from DCR.',
      'Verification: keep the line de-energized while testing resistance, follow manufacturer procedures, and do not declare the line safe or overloaded from DCR alone.'
    ].join('\n\n');
  }

  const impedanceCase = distributedAudio && /(12\.5\s*(?:ohm|ω)|impedance|resistance|ohm's law|ohms law)/i.test(q) && !dmmDcCase;
  const saysHealthy = /(healthy|perfectly functioning|normal load)/i.test(a);
  const saysDirectShort = /(direct|copper|hard)[\s\S]{0,30}short|short circuit/i.test(a);
  if (impedanceCase && (saysHealthy || saysDirectShort)) {
    return [
      'Direct answer: Treat a 12.5-ohm valid AC equivalent load on a nominal 70V speaker line as potentially heavy, not as proof of a healthy line or proof of a direct copper short.',
      'Why it matters: if 12.5 ohms is a valid AC equivalent load, P = V²/Z gives about 392 W at 70 V nominal. That can overload an amplifier rated below that load. A true conductor-to-conductor short trends toward near-zero resistance, so 12.5 ohms by itself does not prove a copper short.',
      'Safest next step: first establish whether the measurement is a valid AC impedance/load measurement rather than DMM DC resistance; then confirm the amplifier rating/output mode, sum all transformer taps, compare expected load to the measured value, and isolate branches if needed.',
      'Verification: transformer-coupled distributed lines require the correct load-measurement method; do not substitute DCR for AC impedance.'
    ].join('\n\n');
  }

  const councilCase = /(council|chamber|boardroom|desk microphone|mix-minus|automix|automixer|neighbor zone|adjacent)/i.test(q);
  const neighborOverhead = /(neighbor|adjacent)/i.test(a) && /(overhead|ceiling)[\s-]*(speaker|loudspeaker)|speaker|loudspeaker/i.test(a) && /(unity|route|feed|send|cross-point|crosspoint)/i.test(a);
  if (councilCase && neighborOverhead) {
    return `${a}\n\nTechnical correction: Do not default to reinforcing an adjacent person's microphone through the nearby overhead loudspeaker. At close seating distances that can create a local feedback path. First verify natural acoustic audibility, desk/furniture obstruction, microphone placement, automixer/gating threshold, gain structure, and the intended mix-minus/zoning design. Add local reinforcement only when the acoustic design and gain-before-feedback analysis support it.`;
  }

  return a;
}

if (typeof originalFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetch(resource, options = {}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) {
      return originalFetch(resource, options);
    }

    let payload;
    try { payload = JSON.parse(String(options.body)); }
    catch { return originalFetch(resource, options); }

    const message = getUserMessage(payload);
    const patchedPayload = addRulesToPayload(payload);
    const response = await originalFetch(resource, {...options, body:JSON.stringify(patchedPayload)});
    if (!response.ok) return response;

    let data;
    try { data = await response.clone().json(); }
    catch { return response; }

    const text = data.output_text || (data.output || []).flatMap(item => item.content || []).map(c => c.text || c.value || '').filter(Boolean).join('\n');
    const guarded = applyAvaTechnicalSafetyV2(message, text || '');
    if (guarded === text) return response;

    data.output_text = guarded;
    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
    return new Response(JSON.stringify(data), {status:response.status, statusText:response.statusText, headers});
  };
}
