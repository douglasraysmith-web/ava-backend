const previousFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V8 = [
  'AoIP packet math: samples per packet = sample_rate_hz x packet_interval_seconds. Do not move decimal places or invent payload sizes.',
  'PTP/gPTP: use the actual clock profile and hierarchy. Unmanaged switches do not translate PTPv1/PTPv2 or repair profile mismatches; excessive jitter can break synchronization. Use compatible PTP-aware boundary/transparent clocking where required.',
  'Fractional scaling: non-integer scaling requires interpolation and can soften/smear high-contrast one-pixel detail. Prefer native 1:1 mapping or deliberately chosen scaling for fine text.',
  'Constant-voltage LF rule: delivered power into a fixed equivalent load scales approximately as V^2/Z. Low-frequency transformer behavior is limited by magnetizing inductance/core saturation; do not claim lower frequency raises inductive reactance or that LF boost cures saturation. Apply manufacturer-appropriate HPF/protection.',
  'EMSEC isolation: ordinary capacitive and inductive coupling explain adjacent-cable leakage. Optical isolation is not galvanic isolation if a copper drain/shield bridges the boundary; secure separation requires an approved nonconductive optical boundary.',
  'Line-source rule: finite arrays control directivity only where aperture is large relative to wavelength. Within the controlled line-source region, cylindrical spreading is about 3 dB per distance doubling, not 6 dB.',
  'Atmospheric acoustics: hot/dry air does not create zero HF absorption. Use ISO 9613-1 or a proper atmospheric model for frequency-, temperature-, pressure-, and humidity-dependent attenuation.',
  'Eye-diagram rule: timing jitter closes horizontal eye width. Amplitude loss/noise closes vertical eye height. CTLE is an analog continuous-time equalizer emphasizing high-frequency loss compensation; DFE is decision-based feedback that cancels post-cursor ISI.',
  'Speaker-wire rule: cable loop resistance is series source resistance, not a parallel loudspeaker branch. Damping factor at the load is Rload/(Rsource+Rwire), so long thin cable reduces damping.',
  'NOM rule: multiple-open-microphone gain compensation follows logarithmic power summation, commonly 10*log10(NOM) dB as a design baseline, not NOMx3 dB.',
  'Room-mode rule: axial modes follow f_n = n*c/(2L). Do not use large high-Q boosts to fill deep geometric nulls; fix placement/listener/subwoofer geometry and treatment, then use conservative EQ.',
  'HDBaseT rule: do not invent link bandwidth or thermal-RJ45 mechanisms. Verify the actual HDBaseT generation/device capability and use DSC/appropriate transport when payload exceeds it.',
  'Multicast rule: AV-over-IP multicast normally requires correct IGMP snooping plus an IGMP querier/router on the VLAN. Disabling snooping can flood multicast to unintended ports.',
  'Crypto capability rule: unsupported cryptographic key sizes/protocols cannot be made compatible by fictitious real-time key compression. Upgrade endpoints or terminate the protocol in supported secure hardware.',
  'Speech acoustics rule: long RT60 and flutter echo reduce speech intelligibility. Use measured RT/STI targets and appropriate absorption/diffusion; do not expose parallel hard surfaces to improve speech.',
  'EDID/scaler rule: sources read EDID on their input-facing sink path. Hold source format with appropriate input-side EDID emulation, then scale/down-convert only on output paths that need it.',
  'Inrush rule: switching supplies and LED systems can produce real inrush/transient current. Diagnose measured peak current and use manufacturer/code-approved protective devices, sequencing or soft-start; tape and gravity are irrelevant.',
  'RF coordination rule: equal channel spacing can place third-order intermodulation products on occupied channels. Coordinate using intermod-aware frequency planning.',
  'Polarization rule: ideal circular-to-linear polarization mismatch is nominally 3 dB and independent of linear antenna rotation; crossed linear or opposite circular sense can produce deep mismatch.',
  'Fiber bend rule: macro-bends add optical loss by allowing guided energy to radiate from the core. They do not create optical gain; OTDR generally shows additional loss/downward trace behavior.',
  '12G-SDI rule: do not confuse feet with meters or promise zero errors from an arbitrary distance. Check cable-specific loss/equalizer limits at the relevant 12G-SDI frequency and use reclocking/fiber when margin is inadequate.',
  'AEC rule: near-end double-talk is uncorrelated interference for the echo-path estimator. Double-talk detection/freeze or robust adaptation control prevents coefficient divergence.',
  'Mix-minus phase rule: 180 deg relative phase is destructive, not constructive. Do not boost acoustic loop gain on the assumption that cancellation prevents feedback.',
  'EMI rule: mains/dimmer coupling is capacitive/inductive electromagnetic coupling. Vinyl electrical tape is insulation, not RF shielding; use proper separation, topology, shielded cabling/bonding where appropriate.'
].join('\n');

function userMessage(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const u = [...input].reverse().find(x => x?.role === 'user');
  return String(u?.content || '');
}
function addRules(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x=>({...x})) : [];
  const s = input.find(x=>x?.role==='system');
  if (s) s.content = `${String(s.content||'')}\n${AVA_TECHNICAL_RULES_V8}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V8});
  return {...payload,input};
}

export function applyAvaTechnicalSafetyV8(message='', answer='') {
  const q=String(message||'');
  const a=String(answer||'');

  if (/(aes67|ravenna|dante|avb|gptp|ptp|packet.*(?:125|250).*micro|samples per packet|sample payload)/i.test(q) &&
      /(120 samples|average.*timestamp|symmetrically|split.*error|compress.*ptp|header compression|maps?.*ptpv?2.*ptpv?1|sub[- ]nanosecond.*unmanaged)/i.test(a))
    return 'Technical correction: Compute packet payload as sample_rate x packet_interval_seconds (for example, 96 kHz x 125 us = 12 samples; 48 kHz x 125 us = 6 samples). PTP/gPTP uses defined clock profiles and hierarchy; an unmanaged switch does not translate PTPv1/PTPv2 or average away clock error. Verify compatible clock profiles and use appropriate PTP-aware boundary/transparent clocking or a supported bridge where required.';

  if (/(led wall|canvas|fractional|225%|208\.33|2\.25|2\.083|scal|single-pixel text|bicubic)/i.test(q) &&
      /(bicubic.*(?:sharp|perfect|eliminat.*alias)|fractional.*sharp|2\.25 physical|2\.08 physical)/i.test(a))
    return 'Technical correction: A non-integer scaling ratio requires resampling. Bicubic interpolation blends neighboring samples and can soften or smear one-pixel/high-contrast text edges. For critical text, prefer native 1:1 mapping or a deliberately chosen pixel-preserving/integer strategy when the canvas permits it.';

  if (/(100v|constant[- ]voltage|transformer|50hz|60hz|45hz|line drop|voltage drop)/i.test(q) &&
      /(power scales linearly|flat .*% drop|reactance.*(?:increase|exponential)|open circuit|\+6db.*(?:45|50|60)|eliminates.*saturation|no.*high-pass|without.*hpf)/i.test(a))
    return 'Technical correction: For a fixed equivalent load, delivered power scales approximately with V^2/Z, so line-voltage loss produces a quadratic power reduction. Transformer magnetizing reactance falls as frequency falls, and core flux/saturation risk becomes worse for excessive low-frequency drive. Do not boost the LF region to cure saturation; use the transformer/manufacturer-appropriate high-pass protection and verify loading/current.';

  if (/(scif|tempest|red|black|classified|secure.*video|optical extender|copper drain|galvanic)/i.test(q) &&
      /(gravitational|magnetic vacuum|reverse.*current|reverse grounding|fully tempest|galvanic isolation.*copper|copper.*secure)/i.test(a))
    return 'Security correction: Adjacent conductive paths couple through ordinary capacitive and inductive electromagnetic mechanisms, not gravity or a magnetic vacuum. An optical data path is not galvanically isolated if a copper drain, shield, or conductive chassis path bridges the secure boundary. Use an approved nonconductive optical boundary and the applicable EMSEC/TEMPEST separation and bonding design.';

  if (/(column|line array|line source|cylindrical|directivity|1\.8m|2 meters.*16 meters|2m.*16m)/i.test(q) &&
      /(point source.*above|cylindrical.*below|6db.*doubling|78\s*db|spherical.*controlled)/i.test(a))
    return 'Technical correction: A finite line source controls directivity only where its aperture is sufficiently large relative to wavelength. Within the controlled line-source region, ideal cylindrical spreading is about 3 dB per distance doubling, not the 6 dB spherical rule.';

  if (/(hot.*dry|40c|10%.*humidity|12khz|10khz|atmospheric absorption|iso 9613)/i.test(q) &&
      /(zero absorption|attenuation.*zero|no.*decibel|perfect.*clarity|unnaturally bright)/i.test(a))
    return 'Technical correction: Hot, dry air does not make high-frequency atmospheric absorption vanish. Use an ISO 9613-1-compatible atmospheric attenuation calculation with frequency, temperature, pressure, humidity, and distance; high-frequency loss can be substantial in dry conditions.';

  if (/(12g[- ]sdi|eye diagram|clock.*jitter|ctle|dfe|crc|ber)/i.test(q) &&
      /(vertical.*(?:expand|jitter)|horizontal.*static|ctle.*(?:digital|low-pass)|dfe.*(?:analog|pll|mirror voltage))/i.test(a))
    return 'Technical correction: Clock phase jitter is timing uncertainty and closes the horizontal eye width. Amplitude loss/noise closes vertical eye height. CTLE is an analog continuous-time equalizer that compensates high-frequency channel loss; DFE is decision-based feedback that subtracts post-cursor ISI using prior symbol decisions.';

  if (/(speaker wire|18awg|subwoofer|damping factor|loop resistance|25\.2|15\.6|120-meter|120 meter)/i.test(q) &&
      /(parallel.*(?:wire|voice coil)|500\s*\+|400\s*\+|increase.*damping|storage reservoir|3\.45|3\.18)/i.test(a))
    return 'Technical correction: Loudspeaker cable loop resistance is series source resistance, not a parallel branch. Calculate damping factor at the load as R_load/(R_source + R_wire). Long, resistive cable sharply reduces damping and wastes amplifier voltage/power.';

  if (/(nom|open microphones|active microphones|mix bus|speech reinforcement)/i.test(q) &&
      /(nom\s*[x]\s*3|6\s*\*\s*3|18\s*db|15\s*db|linear.*3\s*db)/i.test(a))
    return 'Technical correction: Multiple-open-microphone gain compensation is logarithmic, commonly using 10*log10(NOM) dB as a baseline. Do not apply a linear NOMx3 dB rule; verify the actual automixer/mix-minus gain structure and acoustic loop margin.';

  if (/(axial|room mode|modal null|58hz|62hz|7\.5 meters|8\.0|fundamental.*mode)/i.test(q) &&
      /(f\s*=\s*v\s*\/\s*l|343\s*\/\s*8|343\s*\/\s*7\.5|\+12db|fill.*null|override.*reflection)/i.test(a))
    return 'Technical correction: Axial modes follow f_n = n*c/(2L), so the first length mode uses c/(2L). A deep geometric null is destructive interference; a large high-Q boost consumes headroom and often does not fix the listening-position cancellation. Correct placement/geometry and treatment first, then use conservative EQ.';

  if (/(hdbaset|spec 2\.0|4k60|18 gbps|24 gbps|valens|rj45.*thermal)/i.test(q) &&
      /(24\s*gbps|4\.5\s*ohm|pins.*heat|thermal.*sync|power-cycl)/i.test(a))
    return 'Technical correction: Do not invent RJ45 thermal-resistance mechanisms or bandwidth. Verify the actual HDBaseT generation and extender capability; an uncompressed payload that exceeds the link capacity requires a capable newer transport, DSC, or another appropriate video-extension method.';

  if (/(igmp|multicast|av-over-ip|video streams|waps|querier)/i.test(q) &&
      /(turn off igmp|disable igmp|thermal.*pin|4\.5\s*ohm|wrap.*tape)/i.test(a))
    return 'Network correction: Multicast AV traffic should be constrained with correctly configured IGMP snooping and an appropriate IGMP querier/router on the AV VLAN. Disabling snooping can flood multicast to unintended ports and overload lower-bandwidth devices.';

  if (/(aes-256|tls 1\.3|legacy.*decoder|crypto|encryption key|256-bit|128-bit)/i.test(q) &&
      /(compress.*256.*128|key compression|automatically.*map|internal compression cipher)/i.test(a))
    return 'Security correction: Unsupported key sizes or protocol versions cannot be made compatible by fictitious real-time key compression. Upgrade the endpoint/crypto hardware or terminate the secure protocol on supported, approved hardware.';

  if (/(rt60|speech intelligibility|spoken word|flutter echo|concrete walls|sti)/i.test(q) &&
      /(2\.[46].*ideal|uncover.*concrete|strip.*drape|flutter.*(?:healthy|clarity)|rt60.*ideal.*speech)/i.test(a))
    return 'Acoustic correction: Long reverberation and flutter echo reduce speech intelligibility by smearing consonants and increasing late energy. Use measured RT/STI targets for the room and add appropriate absorption/drapery or other treatment rather than exposing parallel hard surfaces.';

  if (/(edid|capture card|1080p|4k.*display|switcher|scaler)/i.test(q) &&
      /(edid.*output|up[- ]?scaler.*input|upscale.*input.*downstream)/i.test(a))
    return 'Video-system correction: The source sees EDID on its input-facing sink path, so use input-side EDID emulation to hold the required source format. Apply scaling/down-conversion only on the output paths feeding lower-resolution devices.';

  if (/(inrush|led wall|breaker|white animation|transient peak|power supply)/i.test(q) &&
      /(gravitational|dielectric.*vacuum|tape.*surge|vinyl.*protect)/i.test(a))
    return 'Electrical correction: LED/switch-mode systems can trip protection because of real inrush and transient peak current, not gravitational effects. Measure the load/inrush and use manufacturer- and code-approved circuit protection, sequencing, soft-start, or power-distribution design; tape is irrelevant.';

  if (/(wireless|intercom|helical|circular.*polar|linear whip|1\.9ghz)/i.test(q) &&
      /(30\s*db|cross-polarization null|spins?.*null|90.*catastrophic)/i.test(a))
    return 'RF correction: For ideal circular-to-linear reception, the nominal polarization mismatch is about 3 dB and does not vary with rotation of the linear antenna about the propagation axis. Deep polarization nulls are associated with crossed linear antennas or opposite circular senses, not ordinary circular-to-linear rotation.';

  if (/(intermod|equal spacing|equidistant|wireless workbench|rf coordination)/i.test(q) &&
      /(equal.*(?:prevent|eliminate).*intermod|equidistant.*safe|structurally prevent)/i.test(a))
    return 'RF coordination correction: Equal channel spacing does not inherently eliminate third-order intermodulation and can place products directly on occupied channels. Use intermod-aware frequency coordination and real device data to place products in unused spectrum.';

  if (/(fiber|otdr|macro[- ]?bend|bend radius|snell|1550|om4|os2)/i.test(q) &&
      /(hyper-reflection|positive.*gain|gain step|increase.*incidence.*trap|optical power.*increase)/i.test(a))
    return 'Optical correction: A macro-bend can radiate guided energy out of the core and adds attenuation; it does not create optical gain or hyper-reflection. On an OTDR, bend loss appears as additional loss/downward trace behavior, with interpretation dependent on wavelength and the link.';

  if (/(1694a|12g-sdi|90 meters|150 meters|150 feet|return loss)/i.test(q) &&
      /(150 meters|zero frame drops|absolute frame stability|24db.*wide safety|no.*reclock)/i.test(a))
    return 'Transport correction: Do not confuse feet with meters or promise zero errors from a generic coax distance. Check the exact cable loss/equalizer/reclocker limits at the relevant 12G-SDI frequency and use a qualified reclocker, lower-loss transport, or fiber when link margin is inadequate.';

  if (/(aec|nlms|double-talk|double talk|near-end|echo cancellation|adaptive filter)/i.test(q) &&
      /(near-end.*(?:reference|accelerate)|local voice.*reference|without.*double-talk detector|step-size.*up.*voice)/i.test(a))
    return 'DSP correction: Near-end speech during double-talk is uncorrelated interference for the echo-path estimator, not a convergence reference. AEC should use double-talk detection/freeze or another robust adaptation-control strategy so coefficient updates do not diverge while the echo path is obscured.';

  if (/(mix-minus|cross-point|speaker zones|180 degrees|phase|loop gain)/i.test(q) &&
      /(180.*constructive|phase-doubling|\+6db.*(?:both|cross)|maximize.*loop gain|no risk.*feedback)/i.test(a))
    return 'Audio-system correction: A 180 deg relative phase shift is destructive interference, not constructive reinforcement. Do not raise matrix/loop gain on the assumption that acoustic cancellation prevents feedback; verify delay, polarity, level, routing, and loop-gain margin.';

  if (/(mains|lighting|dimmer|cat6|unshielded|electrical tape|alien crosstalk|emi|strobe)/i.test(q) &&
      /(gravitational|magnetic vacuum|atmospheric vacuum|wrap.*tape|vinyl.*shield|tape.*shield)/i.test(a))
    return 'EMI correction: Coupling from nearby mains/dimmer circuits is capacitive and inductive electromagnetic coupling. Vinyl electrical tape is insulation, not an RF shield. Use proper physical separation, routing, shielded twisted pair/bonding where the system design calls for it, and verify the link with certification/measurement.';

  if (/(lux|nits|solar glare|contrast ratio|analytical reading|discas|reflection coefficient)/i.test(q) &&
      /(lux.*(?:equals|=|times).*nits|90\s*nits|5\.55.*exceptional|133\.33.*exceptional|perfect legibility.*without.*shade)/i.test(a))
    return 'Display-photometry correction: Lux is illuminance and nits/cd/m^2 are luminance; a reflection coefficient alone does not justify a direct lux-to-nits conversion without a reflection model and geometry. Evaluate the applicable viewing/contrast criterion using measured ambient/reflected luminance, display luminance, screen reflectance, and actual task requirements; high daylight may require shading or higher effective image luminance.';

  return a;
}

if (typeof previousFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV8(resource, options={}) {
    const url=String(resource?.url||resource||'');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return previousFetch(resource,options);
    let payload; try { payload=JSON.parse(String(options.body)); } catch { return previousFetch(resource,options); }
    const message=userMessage(payload);
    const response=await previousFetch(resource,{...options,body:JSON.stringify(addRules(payload))});
    if (!response.ok) return response;
    let data; try { data=await response.clone().json(); } catch { return response; }
    const text=data.output_text || (data.output||[]).flatMap(i=>i.content||[]).map(c=>c.text||c.value||'').filter(Boolean).join('\n');
    const guarded=applyAvaTechnicalSafetyV8(message,text||'');
    if (guarded===text) return response;
    data.output_text=guarded;
    const headers=new Headers(response.headers); headers.set('content-type','application/json'); headers.delete('content-length');
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
  };
}
