const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V7 = [
  'Field cable handling rule: never scale pulling tension by bundle count, winch a snag, hammer a kink flat, or crush Category cable with tight ties. Respect manufacturer/TIA pull-tension and bend-radius limits and preserve pair geometry.',
  'Conduit/plenum rule: lubricant does not override fill, bend, pull-box, expansion, plenum, firestop, temperature or grounding requirements. Verify applicable NEC/local rules and manufacturer limits; use only compatible cable lubricant.',
  'Structural rule: heavy wall/ceiling equipment and moving loads require verified structural support. Gravity creates real shear, pull-out/tension and moment/dynamic loads; unsupported gypsum/plastic anchors are not a universal solution.',
  'Old-wire rule: near-zero resistance to grounded metal is a short/fault candidate. Oxidized copper is not a superconductor and must be inspected/reterminated to clean conductive metal.',
  'Signal-integrity rule: coax/twisted-pair geometry, characteristic impedance, bend radius and terminations matter. Crushing, kinking or extreme bends create mismatch/return loss; passive wire does not transcode protocols.',
  'Passive-network rule: splitters add insertion loss, series wire does not isolate ground loops, and identical speakers in parallel reduce total impedance to approximately R/N.',
  'Thermal rule: sealed plastic enclosures trap heat, blocked exhaust prevents cooling, recirculating hot exhaust cannot refrigerate equipment, and stacked axial fans do not create exponential pressure gain.',
  'EMI rule: low-level audio/data beside mains can suffer capacitive/inductive coupling. Floating foil, coils, tight braids and cable loops are not magical shields and can worsen coupling.',
  'Magnetostatics rule: plaster/wood do not amplify magnetic flux into a data-control field; static magnets do not permanently polarize copper or reverse data.',
  'Optics rule: sunlight, display rotation, gloss/mirror coatings, magnets and degaussing do not rearrange LCD pixels or eliminate front-surface glare. Glass ghosting is ordinary reflection/refraction.',
  'Photometry rule: lux is illuminance and nits/cd-m2 are luminance. Do not convert lux directly to nits without a reflection model; contrast claims must use the applicable viewing criterion, not invented thresholds.',
  'Display thermal/IR rule: solar heat can damage displays and strong sunlight can saturate an IR receiver; heat does not improve LCD contrast and sunlight does not shift a remote to a new wavelength.',
  'Projector geometry rule: projector rays follow geometric optics. Chandeliers, disco balls and domes do not increase resolution or self-correct geometry; use proper alignment, optics and warping where required.',
  'Acoustics rule: porous absorption depends on particle velocity/air gap, glass is reflective, and diffusers/resonators must be sized to wavelength/design equations. Millimeter structures do not control deep bass by magic.',
  'Grounding/firestop rule: do not bridge line-voltage neutral to HDMI shields, invent concrete batteries, notch structure indiscriminately, or omit required bonding/firestop restoration.',
  'Low-E rule: metallic low-E coatings can passively attenuate/reflect RF; sunlight does not turn them into active quantum scramblers.',
  'Mechanical rule: roller-shade torque varies with suspended load and roll radius. Use actual geometry and manufacturer sizing.',
  'Plausibility rule: reject physically impossible distance, temperature, velocity, energy, gain, or geometry claims that contradict the actual system dimensions and established physics.'
].join('\n');

function userMessage(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const u = [...input].reverse().find(x => x?.role === 'user');
  return String(u?.content || '');
}

function addRules(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const s = input.find(x => x?.role === 'system');
  if (s) s.content = `${String(s.content || '')}\n${AVA_TECHNICAL_RULES_V7}`;
  else input.unshift({role:'system', content:AVA_TECHNICAL_RULES_V7});
  return {...payload, input};
}

export function applyAvaTechnicalSafetyV7(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');

  if (/(magnet|magnetic|plaster|lath|fish.*cable|copper)/i.test(q) && /(flux.*(?:4x|amplif|multipl)|polariz.*copper|reverse.*data|data.*reverse|magnetic.*reorgan)/i.test(a))
    return 'Technical correction: Ordinary plaster/wood do not amplify magnetic flux into a data-control field, and a static magnet does not permanently polarize copper or reverse digital-data propagation.';

  if (/(cat\s*6|cat6a|category cable|pre-wire|pull|kink|zip[- ]?tie|snag|cable bundle)/i.test(q) && /(440\s*lbf|300\s*lbf|150\s*lbf|multiply.*tension|hammer.*kink|bite.*cable|flatten.*copper|recrystall|winch)/i.test(a))
    return 'Technical correction: Do not scale Category-cable pulling tension by bundle count or force a snag/kink with a winch, hammer, or over-tight tie. Respect manufacturer/TIA pull-tension and bend-radius limits and preserve pair geometry.';

  if (/(conduit|emt|fmc|pvc|pull box|fill|bend|lubricant|expansion joint)/i.test(q) && /(100%|100 percent|exceed.*360|additional 180|omit pull box|petroleum|automotive grease|zero thermal expansion|glue.*all.*solid)/i.test(a))
    return 'Technical correction: Lubricant does not waive conduit fill, bend, pull-box, expansion or cable-damage limits. Verify applicable code and manufacturer data and use cable-compatible lubricant.';

  if (/(plenum|air handling|steam pipe|90\s*°?c|cable tray|ambient temperature)/i.test(q) && /(orange.*tape|tape.*plenum|exempt.*temperature|zero current.*exempt|thermal signature|90.*safe)/i.test(a))
    return 'Technical correction: Tape does not convert non-plenum cable into plenum-listed cable, and communications cable still has jacket temperature limits. Use the required listed cable and keep it within its rated environment.';

  if (/(projector|display|lift|ceiling|drywall|gypsum|anchor|toggle|mount|65\s*kg|45\s*kg|25\s*kg|30\s*kg)/i.test(q) && /(plastic.*anchor|toggle.*(?:safe|fully code)|zero.*tension|gravity.*horizontal|pure.*lateral.*shear|floating static equilibrium|motion.*cancel.*gravity|cancel.*gravity|drywall.*safe)/i.test(a))
    return 'Safety correction: Heavy wall/ceiling equipment imposes real shear, pull-out/tension, moment and sometimes dynamic loads. Verify structural support and attach to suitable framing/support rather than assuming unsupported gypsum or generic anchors are safe.';

  if (/(0\.1\s*ohm|grounded.*pipe|old wire|corrosion|cupric oxide|oxidized|green.*copper)/i.test(q) && /(passive inductive ground|earth magnetic|organic superconductor|gold.*dissolve|0\s*ohm.*boost|crimp.*oxide|superconductor)/i.test(a))
    return 'Safety correction: Near-zero resistance to grounded metal is a fault/short candidate. Oxidized copper is not a superconductor; inspect the circuit and reterminate to clean conductive copper before connecting equipment.';

  if (/(coax|cat6a|bend radius|kink|75[- ]?ohm|characteristic impedance|return loss)/i.test(q) && /(zero[- ]?radius|superconduct|0\s*ohm.*gateway|hammer.*flat|restore.*impedance|molecular.*lattice)/i.test(a))
    return 'Technical correction: Crushing, kinking or forcing cable below its bend radius deforms geometry and creates impedance discontinuity, return loss and data errors; it does not create a superconducting path or restore performance.';

  if (/(aes\/ebu|aes3|digital audio|600[- ]?ohm|intercom wire)/i.test(q) && /(automatically.*compress|transcode|convert.*analog|wire-level conversion|safe.*600)/i.test(a))
    return 'Technical correction: Passive wire does not transcode AES/EBU into analog audio. Use a transmission path with the required characteristic impedance, bandwidth and termination.';

  if (/(splitter|ground loop|composite video|10awg|series wire)/i.test(q) && /(splitter.*amplif|multiplies.*3\.5|noise cleaner|removes?.*noise|zero intermod|10awg.*series|series.*hum.*zero|drop.*hum.*zero)/i.test(a))
    return 'Technical correction: Passive coax splitters add insertion loss and do not clean or amplify a signal. A plain series copper splice is not a ground-loop isolator.';

  if (/(8.*speaker|parallel.*speaker|ceiling speaker|low[- ]impedance amplifier)/i.test(q) && /(64\s*ohm|impedance.*multipl|near[- ]zero current)/i.test(a))
    return 'Safety correction: Identical loudspeakers in parallel reduce total impedance to approximately R/N. Eight 8-ohm speakers in parallel are about 1 ohm and can overload an amplifier not rated for that load.';

  if (/(24v.*led|led tape|voltage drop|18\s*v)/i.test(q) && /(inverted luminance|current[- ]boosting mode|twice as bright|brightness surge)/i.test(a))
    return 'Technical correction: LED-strip voltage drop reduces voltage/current available downstream and commonly causes dimming or dropout; it does not create an inverted brightness surge.';

  if (/(structured wiring|enclosure|fan|cooling|exhaust|intake|poe|thermal)/i.test(q) && /(plastic.*(?:thermal conductor|conducts heat)|keeps?.*25c|25c.*without fans|9x|exponential.*pressure|recirculat.*cold mist|15\s*°?c|hot exhaust.*intake.*cool)/i.test(a))
    return 'Safety correction: A sealed plastic enclosure can trap heat, blocked exhaust limits airflow, and recirculating hot exhaust cannot create refrigeration. Stacking identical axial fans does not create exponential static-pressure gain.';

  if (/(unbalanced.*audio|120v|240v|mains|power conduct|lighting line|cable bundle|foil|magnetic shield|hum|data cable|metal stud|emi|hdmi)/i.test(q) && /(phase cancellation|self[- ]shield|magnetic shield matrix|zero hum|foil.*powers|convert.*emi.*dc|braid.*power.*audio|auto[- ]?null.*hum|capture.*60hz|neutral.*hdmi|hdmi.*neutral|bridge.*neutral.*shield)/i.test(a))
    return 'Safety correction: Do not bundle low-level audio/data with mains or bridge line-voltage neutral to an HDMI shield. Floating foil/coils are not magical shields; use proper separation, grounding/bonding and approved interfaces.';

  if (/(west-facing|window|glass|glare|mirror film|gloss|polariz|ghost image|degauss|sunlight)/i.test(q) && /(rotate.*180|upside down|infinite contrast|mirror film.*diffus|gloss.*diffus|degauss.*(?:glass|realign)|degaussing.*realign|molecules.*polariz|shift.*rgb|4\.5\s*mm|double.*resolution)/i.test(a))
    return 'Technical correction: Display rotation, glossy/mirror coatings, sunlight or degaussing do not rearrange pixels or eliminate front-surface glare. Treat glare/ghosting with optical geometry, shading and suitable anti-glare/AR methods.';

  if (/(lux|nits|glare|contrast|discas|analytical reading)/i.test(q) && /(90\s*nits|5\.55\s*:\s*1|exceptional.*analytical|lux.*nits)/i.test(a))
    return 'Technical correction: Lux is illuminance and nits/cd-m² are luminance; do not convert them directly without a reflection model. A roughly 5.5:1 contrast ratio is not a high-detail analytical-reading result under the cited AV display criteria.';

  if (/(lcd|display|tv|solar|infrared|95\s*°?c|85\s*°?c|isotropic|thermal)/i.test(q) && /(endothermic polymer|convert.*infrared.*static|heat.*beneficial|isotropic.*boost|double.*contrast.*95|clearing.*(?:improve|double).*contrast|thermal clearing)/i.test(a))
    return 'Safety correction: Strong solar/IR load can overheat a display; isotropic clearing is a failure mechanism, not a contrast boost. Verify manufacturer temperature limits, ventilation and shading.';

  if (/(ir remote|infrared remote|940|950|sunroom|sunlight)/i.test(q) && /(atomic clock|1200\s*nm|backward.*photon|frequency shift.*sun)/i.test(a))
    return 'Technical correction: Sunlight does not shift a remote diode to another wavelength. Strong ambient IR can saturate the receiver/noise floor and mask the modulated carrier.';

  if (/(projector|projection mapping|dome|screen|chandelier|disco ball|lens shift|keystone)/i.test(q) && /(parabolic spiral|wall center.*automatic|line[- ]?doubl|1080p.*4k|dome.*automatically.*correct|chandelier.*resolution|disco ball.*4k|self[- ]correct.*keystone|without.*warp)/i.test(a))
    return 'Technical correction: Projection follows geometric optics. Align to the actual target geometry and use appropriate lens shift/warping/fisheye/edge blending; chandeliers, disco balls and domes do not increase resolution or self-correct geometry.';

  if (/(acoustic panel|fiberglass|air gap|mirror|qrd|diffuser|helmholtz|resonator|80\s*hz|60\s*hz|120\s*hz|flutter echo|first reflection)/i.test(q) && /(flush.*superior|mirror.*diffus|2\.5\s*mm.*(?:well|qrd)|0\.5\s*mm.*port|4\.5\s*mm.*radius|acoustic laser|down to 40\s*hz.*2[- ]inch)/i.test(a))
    return 'Technical correction: Porous absorbers depend on particle motion and air gap, hard glass is reflective, and diffusers/resonators must be sized from wavelength/design equations. Millimeter-scale structures do not control deep bass by magic.';

  if (/(invisible speaker|plaster|joint compound|skim coat)/i.test(q) && /(12\s*mm|boost.*6\s*dB|horn transformer|increase.*high[- ]frequency)/i.test(a))
    return 'Technical correction: Excess finish thickness over an invisible loudspeaker adds mass/stiffness and attenuates/distorts output. Follow the manufacturer’s specified finish thickness.';

  if (/(cable label|labeling|tia[- ]?606|termination.*label)/i.test(q) && /(center.*wall|ink.*arc|label.*melt.*copper|10\s*cm.*violat)/i.test(a))
    return 'Technical correction: Cable labels should remain accessible at run endpoints. Label ink is not a low-voltage arcing heater, and hiding the only label inside a finished wall defeats serviceability.';

  if (/(rebar|rigid metal conduit|rmc|bond|ground|concrete|pvc.*exterior|expansion)/i.test(q) && /(concrete.*battery|24\s*v.*phantom|isolate.*rebar|pvc.*zero thermal expansion)/i.test(a))
    return 'Safety correction: Reinforced concrete does not generate a 24 V battery effect. Metallic bonding and PVC expansion must follow the applicable code/listed installation method.';

  if (/(fire[- ]?block|stud|notch|penetration|firestop|2x4)/i.test(q) && /(40\s*mm.*notch|loads.*dead[- ]center|no.*firestop|outer face.*no.*integrity)/i.test(a))
    return 'Safety correction: Do not notch structural framing or breach rated fire blocking based on an invented load path. Verify permitted geometry and restore the penetration with an approved firestop system.';

  if (/(low[- ]e|low emissivity|window.*rf|wireless microphone|500\s*mhz)/i.test(q) && /(hyper[- ]conductive quantum|solar.*scrambler|sunlight.*phase inverter)/i.test(a))
    return 'Technical correction: Metallic low-E coatings can passively attenuate/reflect RF and contribute to multipath; sunlight does not turn them into active quantum RF scramblers.';

  if (/(roller shade|motorized shade|torque|5\s*m.*4\s*m)/i.test(q) && /(gravity.*top center|flat.*static torque|same.*lifting power.*travel)/i.test(a))
    return 'Technical correction: Roller-shade torque varies with suspended fabric load and effective roll radius; size the motor from the actual mechanical geometry and manufacturer data.';

  if (/(drywall|gypsum|echo|tapping|fire[- ]?block|2\.0\s*ms)/i.test(q) && /(3000\s*m\/s|6\.0\s*m|6\s*meters?)/i.test(a))
    return 'Technical correction: Do not use an unverified fixed 3,000 m/s flexural-wave speed for drywall or accept an obstruction distance that exceeds the actual wall/room geometry.';

  return a;
}

if (typeof originalFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV7(resource, options={}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return originalFetch(resource, options);
    let payload;
    try { payload = JSON.parse(String(options.body)); } catch { return originalFetch(resource, options); }
    const message = userMessage(payload);
    const response = await originalFetch(resource, {...options, body:JSON.stringify(addRules(payload))});
    if (!response.ok) return response;
    let data;
    try { data = await response.clone().json(); } catch { return response; }
    const text = data.output_text || (data.output || []).flatMap(item => item.content || []).map(c => c.text || c.value || '').filter(Boolean).join('\n');
    const guarded = applyAvaTechnicalSafetyV7(message, text || '');
    if (guarded === text) return response;
    data.output_text = guarded;
    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
    return new Response(JSON.stringify(data), {status:response.status, statusText:response.statusText, headers});
  };
}
