const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V4 = [
  'Transformer low-frequency rule: inductive reactance is X_L = 2*pi*f*L and therefore falls linearly as frequency falls. Low-frequency transformer/core saturation can collapse effective impedance toward winding resistance and increase current; never describe low frequency as making the transformer an open circuit, and never boost the fault frequency as a remedy. Use an appropriate HPF and verify transformer bandwidth/manufacturer limits.',
  'Image-scaling rule: non-integer scaling ratios require resampling. Bilinear/bicubic interpolation blend neighboring samples and can soften fine high-contrast detail; nearest-neighbor duplicates source samples unevenly at non-integer ratios and can create jagged edges/pixel-jitter. Never claim fractional scaling is inherently lossless or sharper.',
  'Anamorphic projection rule: when a horizontal-expansion anamorphic lens is used for scope content, preserve/use the intended active vertical resolution and apply the required vertical stretch/geometry mapping; do not invent a vertical compression that wastes active pixels. Treat ratios such as 1606/2160 as non-integer resampling, not a clean integer factor.',
  'Dante latency rule: receiver latency is a packet-arrival deadline, not merely serialization time. A 0.25 ms Dante setting is only appropriate for very shallow topologies (commonly up to about 3 switch hops); cascaded 5-8 switch paths require a larger supported latency setting and verification of switch forwarding/queueing/PTP behavior.',
  'Precision-time rule: PTP/gPTP follows an elected grandmaster hierarchy; nodes do not average time across peers to cancel a bad clock. Multi-microsecond PDV or clock skew is not negligible for sub-microsecond media synchronization. Diagnose PTP-aware boundary/transparent clock support, timestamping, path asymmetry, queueing, and grandmaster/domain configuration.',
  'Fiber-bend rule: macro/micro-bending reduces confinement/TIR margin and introduces optical loss; an OTDR bend event is a non-reflective attenuation/drop, not positive optical gain. Never invoke hyper-reflection or constructive optical gain from a passive cable bend.',
  'AEC double-talk rule: near-end speech during double-talk is uncorrelated interference to the adaptive echo-path estimator. A DTD should inhibit/freeze or safely control coefficient adaptation during double-talk; do not claim near-end speech should accelerate NLMS convergence.',
  'Damping-factor rule: system damping factor is approximately R_load/(R_source + R_wire). Speaker-cable resistance is series resistance and reduces damping factor; it does not add to the amplifier damping factor or act as an electrical cushion/storage reservoir.',
  'Speaker-wire topology rule: wire loop resistance is in series with a loudspeaker load, not parallel. Large series resistance raises total circuit resistance, reduces current and voltage/power delivered to the loudspeaker, wastes power as heat, and severely reduces damping factor.',
  'NOM rule: number-of-open-microphones gain compensation is logarithmic, approximately 10*log10(NOM) dB where that convention is used; never multiply NOM by a flat 3 dB or 6 dB per microphone.',
  'Line-source rule: within the region where a true line source/column maintains line-source behavior, spreading is approximately cylindrical with about 3 dB loss per distance doubling. Directivity control improves when wavelength is short relative to array length; below roughly f=c/L control progressively collapses toward broader/point-source behavior.',
  'Acoustic-phase rule: equal-amplitude signals arriving 180 degrees out of phase destructively interfere; they do not constructively double. Never recommend adding gain into an active acoustic loop as a way to cancel feedback without a demonstrated stable transfer-function solution.',
  'RF power/intermod rule: intermodulation is produced by nonlinear RF stages and overloaded receiver/transmitter components. Increasing drive/output power can worsen third-order intermodulation as nonlinear stages are driven harder; never claim higher RF power makes a nonlinear amplifier cooler or inherently more linear.',
  'AVB/MSRP rule: MSRP/802.1Qat operates at Layer 2 and reserves/registers streams with Ethernet/TSN mechanisms; it does not use Layer-3 DiffServ as its reservation protocol. Ordinary Ethernet switches do not transparently transcode uncompressed AV payloads to MP3 to save bandwidth.',
  'Dante fan-out rule: unicast requires per-destination flows; a transmitter does not create one magical unicast bundle that the switch replicates to arbitrary destinations. Respect device flow limits and use supported multicast flows when many receivers need the same channels.',
  'EMSEC physics rule: explain unintended emissions/cross-coupling using established conductive, capacitive, inductive, common-mode, radiated near/far-field mechanisms. Reject invented gravitational/electrostatic-vacuum/electron-packet terminology.',
  'RED-BLACK isolation rule: a conductive copper braid/shield across a required galvanic isolation boundary creates continuity and can carry common-mode/high-frequency energy. Do not claim reverse current cancels emissions; where policy/design requires galvanic isolation, preserve the optical/nonconductive gap and follow the governing certified architecture.',
  'Atmospheric absorption rule: high-frequency atmospheric absorption depends strongly on frequency, temperature, humidity and pressure. Hot, very dry air can produce severe HF loss; never claim low humidity drives HF air absorption to zero.',
  'Eye-diagram rule: timing/phase jitter primarily closes the horizontal eye opening (timing margin); attenuation/amplitude noise/reflections primarily reduce vertical eye height. Do not invert these axes.',
  '12G-SDI coax sanity rule: do not confuse feet and meters. Belden 1694A-class coax for 12G-SDI is commonly in the roughly 45-50 meter / ~150 foot suggested-distance class depending on receiver/equalizer and loss criteria; never claim ~150 meters from a 150-foot figure.',
  'Constant-voltage physical-consistency rule: if series wire resistance is comparable to or larger than the reflected speaker load, solve the circuit as a voltage divider/series impedance network. A calculated drop larger than source voltage signals an inconsistent assumption, not negative-voltage inversion, transformer energy gain, or louder downstream speakers.'
].join('\n');

function userMessage(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const u = [...input].reverse().find(x => x?.role === 'user');
  return String(u?.content || '');
}

function addRules(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const s = input.find(x => x?.role === 'system');
  if (s) s.content = `${String(s.content || '')}\n${AVA_TECHNICAL_RULES_V4}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V4});
  return {...payload, input};
}

export function applyAvaTechnicalSafetyV4(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');

  if (/(70v|100v|transformer|distributed audio)/i.test(q) && /(30\s*hz|45\s*hz|low[- ]frequency|core saturation)/i.test(q) && /(reactance.*increase|open circuit|\+\s*6\s*dB|boost.*30\s*hz)/i.test(a)) {
    return 'Technical correction: Inductive reactance X_L = 2πfL decreases as frequency decreases. At sufficiently low frequency a distribution transformer can approach core saturation, effective impedance can collapse toward winding resistance, and current can rise sharply. Do not boost the low-frequency fault. Verify transformer bandwidth and loading and use the manufacturer-appropriate high-pass protection/filtering.';
  }

  if (/(scale|scaling|canvas|nearest[- ]neighbor|bicubic|bilinear|anamorphic|cinemascope|2\.39)/i.test(q) && /(fractional.*sharp|eliminate.*alias|clean integer fractional|nearest[- ]neighbor.*evenly|1606.*2160|vertical compression)/i.test(a)) {
    return 'Technical correction: Non-integer image scaling is resampling, not a lossless integer mapping. Bilinear/bicubic methods interpolate and can soften fine edges; nearest-neighbor duplicates samples unevenly at fractional ratios and can create jagged/pixel-jitter artifacts. For a horizontal-expansion anamorphic lens, preserve the intended active vertical resolution and apply the required stretch/geometry mapping rather than compressing the picture to waste vertical pixels.';
  }

  if (/(dante|switch hop|cascad|latency)/i.test(q) && /0\.25\s*ms/i.test(q) && /(8.*switch|5.*switch|serialization.*below|remain perfect|112\s*(?:us|μs))/i.test(a)) {
    return 'Technical correction: Dante receiver latency is an arrival deadline, not merely the sum of frame-serialization times. A 0.25 ms setting is intended for a very shallow path (commonly up to about three switch hops). A five- or eight-switch cascade requires a larger supported latency setting and verification of forwarding, queueing and clock behavior.';
  }

  if (/(ptp|gptp|2110|aes67|clock|grandmaster|pdv)/i.test(q) && /(8\s*(?:microsecond|μs)|4\s*(?:microsecond|μs)|averag.*timestamp|average.*node|negligible.*packet)/i.test(a)) {
    return 'Technical correction: Media PTP/gPTP is hierarchical around an elected grandmaster and depends on precise timestamp/path-delay behavior; downstream nodes do not average away a bad clock. Multi-microsecond PDV or skew is material for sub-microsecond synchronization. Check PTP-aware boundary/transparent clocks, hardware timestamping, path asymmetry/queueing, domains and grandmaster selection.';
  }

  if (/(fiber|otdr|macro.?bend|micro.?bend|tir|total internal reflection)/i.test(q) && /(hyper[- ]reflection|positive.*gain|gain step|increases.*incidence.*trap|constructive.*bend)/i.test(a)) {
    return 'Technical correction: A fiber bend reduces confinement/TIR margin and introduces attenuation. On an OTDR, a bend normally appears as a localized non-reflective loss/downward attenuation step, not passive optical gain or a positive spike.';
  }

  if (/(aec|nlms|double[- ]talk|echo canceller)/i.test(q) && /(accelerat.*convergence|update.*during double|near[- ]end.*accelerat|use.*local.*energy)/i.test(a)) {
    return 'Technical correction: Near-end speech during double-talk is uncorrelated interference to the echo-path estimator. Adaptation must be inhibited, frozen or robustly controlled by double-talk logic; allowing ordinary NLMS coefficient updates from near-end speech can corrupt/diverge the filter and worsen echo.';
  }

  if (/(damping factor|subwoofer|speaker wire|wire resistance)/i.test(q) && /(damping factor)/i.test(a) && /(\+\s*\(|add.*damping|cushion|storage reservoir|parallel.*wire)/i.test(a)) {
    return 'Technical correction: Cable loop resistance is series resistance. System damping factor is approximately R_load/(R_source + R_wire), so added wire resistance reduces damping factor—often drastically—and reduces loudspeaker control. It is not an electrical cushion or storage reservoir.';
  }

  if (/(speaker wire|subwoofer|4[- ]ohm|8[- ]ohm|loop resistance)/i.test(q) && /(parallel.*wire|wire.*parallel|3\.05\s*ohm)/i.test(a)) {
    return 'Technical correction: Speaker-cable loop resistance is in series with the loudspeaker. Add it to the load for the simple resistive model; large series resistance reduces current and loudspeaker voltage/power, wastes energy in the cable, and collapses damping factor.';
  }

  if (/(nom|open microphones|automixer|mix-minus)/i.test(q) && /(nom\s*[×x*]|\*\s*(3|6)\s*dB|48\s*dB|15\s*dB)/i.test(a)) {
    return 'Technical correction: NOM gain compensation is logarithmic, approximately 10·log10(NOM) dB under this convention. For example, NOM=6 is about 7.78 dB and NOM=8 is about 9.03 dB—not 18/36/48 dB from a linear per-mic multiplier.';
  }

  if (/(line source|column array|cylindrical|distance decay|directivity)/i.test(q) && /(6\s*dB.*doubl|spherical.*controlled|above.*omnidirectional|below.*laser|L\/2)/i.test(a)) {
    return 'Technical correction: In its line-source region a column/line source is approximately cylindrical and loses about 3 dB per doubling of distance, not 6 dB. Directional control exists when the aperture is large relative to wavelength and progressively collapses at lower frequencies; a first-order scale is f≈c/L, not an inverted high-frequency omnidirectional rule.';
  }

  if (/(180|phase|mix-minus|feedback)/i.test(q) && /(180.*constructive|constructive.*180|phase[- ]doubles|\+\s*6\s*dB.*feedback|boost.*cancel.*feedback)/i.test(a)) {
    return 'Technical correction: Equal-amplitude signals 180° out of phase destructively interfere; they do not constructively double. Do not add gain into an active acoustic loop as a generic feedback cure—verify polarity/phase, routing, gain-before-feedback and the actual transfer path.';
  }

  if (/(wireless|rf|intermod|transmit power|mW)/i.test(q) && /(increase.*power.*decreas.*intermod|50\s*mW.*linear|runs cooler|factor of 5.*decreas)/i.test(a)) {
    return 'Technical correction: Intermodulation is generated by nonlinear RF stages. Driving transmitters/receivers harder can worsen third-order products as components approach compression/saturation; higher RF power does not inherently make the stage cooler or more linear. Coordinate frequencies and operate within the equipment linearity/power plan.';
  }

  if (/(avb|tsn|msrp|802\.1qat)/i.test(q) && /(diffserv.*msrp|msrp.*diffserv|transcod.*mp3|switch.*mp3)/i.test(a)) {
    return 'Technical correction: MSRP/802.1Qat is a Layer-2 stream reservation/registration mechanism; it is not Layer-3 DiffServ. A normal Ethernet switch forwards frames and does not transparently transcode multichannel AV payloads to MP3. Unsupported reservation/clock/bandwidth conditions cause stream admission/transport failure, not automatic audio compression.';
  }

  if (/(dante|unicast|multicast|48.*endpoint|fan[- ]out)/i.test(q) && /(single.*unicast.*bundle|switch.*replicat.*unicast|one.*unicast.*flow)/i.test(a)) {
    return 'Technical correction: Unicast is destination-specific; fan-out consumes transmitter flow resources. Respect the Dante device/chipset flow limits and use supported multicast flows when the same channels must reach many receivers.';
  }

  if (/(tempest|emsec|scif|classified|red|black|emanation|cross.?coupl)/i.test(q) && /(gravit|magnetic vacuum|electron.*packet|reverse.*current.*cancel|cancel.*emission)/i.test(a)) {
    return 'Technical correction: Use established electromagnetic mechanisms only—conducted/common-mode coupling, capacitive electric-field coupling, inductive magnetic-field coupling and radiated emissions. Gravity, magnetic vacuums and frame-shaped electron packets are not valid mechanisms. A conductive braid across a required RED/BLACK galvanic boundary creates continuity; preserve the certified nonconductive/optical isolation architecture.';
  }

  if (/(humidity|air attenuation|10\s*khz|12\s*khz|hot.*dry|iso 9613)/i.test(q) && /(zero absorption|absorption.*zero|unnaturally bright)/i.test(a)) {
    return 'Technical correction: High-frequency atmospheric absorption is strongly dependent on frequency, temperature, humidity and pressure. Hot, very dry air can produce substantial HF loss; low relative humidity does not drive acoustic absorption to zero.';
  }

  if (/(sdi|eye diagram|clock jitter|phase jitter)/i.test(q) && /(vertical.*expand|horizontal.*static|jitter.*vertical)/i.test(a)) {
    return 'Technical correction: Timing/phase jitter primarily reduces horizontal eye opening (timing margin). Amplitude noise, attenuation and reflections primarily reduce vertical eye height. Excess horizontal closure moves transitions into the receiver sampling window and increases bit errors.';
  }

  if (/(1694a|12g[- ]sdi|smpte st 2082)/i.test(q) && /(150\s*meter|150m)/i.test(a)) {
    return 'Technical correction: Do not confuse the common ~150-foot class figure with meters. Belden 1694A-class 12G-SDI runs are typically in roughly the 45–50 m (~150 ft) suggested-distance range depending on receiver/equalization and loss criteria; 90–150 m is not the same design assumption.';
  }

  if (/(70v|100v|line resistance|voltage drop|20awg|33[- ]ohm)/i.test(q) && /(negative inversion|step-down current reservoir|boost.*3\s*dB|louder.*final)/i.test(a)) {
    return 'Technical correction: Passive series wire cannot create a negative-voltage gain state or boost the far loudspeaker. If a simple assumed-current drop exceeds source voltage, the assumptions are inconsistent because current itself falls as total series impedance rises. Solve the source + wire + reflected load as a series network/voltage divider and expect severe attenuation and cable heating, not gain.';
  }

  return a;
}

if (typeof originalFetch === 'function') {
  globalThis.fetch = async function avaSafetyV4Fetch(resource, options={}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return originalFetch(resource, options);
    let payload;
    try { payload = JSON.parse(String(options.body)); } catch { return originalFetch(resource, options); }
    const msg = userMessage(payload);
    const response = await originalFetch(resource, {...options, body:JSON.stringify(addRules(payload))});
    if (!response.ok) return response;
    let data;
    try { data = await response.clone().json(); } catch { return response; }
    const text = data.output_text || (data.output || []).flatMap(i => i.content || []).map(c => c.text || c.value || '').filter(Boolean).join('\n');
    const guarded = applyAvaTechnicalSafetyV4(msg, text || '');
    if (guarded === text) return response;
    data.output_text = guarded;
    const headers = new Headers(response.headers);
    headers.set('content-type','application/json'); headers.delete('content-length');
    return new Response(JSON.stringify(data), {status:response.status, statusText:response.statusText, headers});
  };
}
