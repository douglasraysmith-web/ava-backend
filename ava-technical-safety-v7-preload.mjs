const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V7 = [
  'Field cable handling rule: never scale pulling tension linearly with bundle count, use winches to force snags, hammer kinks flat, or crush Category cable with tight ties. Respect the cable manufacturer/TIA pulling-tension and bend-radius limits, stop on a snag, replace visibly damaged/kinked cable when certification is at risk, and preserve pair geometry.',
  'Conduit rule: do not claim lubricant overrides conduit-fill, bend-count, expansion-joint or pull-box requirements. Verify applicable NEC/local requirements, cable fill, cumulative bends, bend radius and approved lubricant compatibility. Do not use petroleum grease on data-cable jackets unless the manufacturer explicitly approves it.',
  'Plenum/temperature rule: cable jacket listing and temperature rating are real constraints. Do not make non-plenum cable acceptable with tape or expose communications cable to temperatures beyond its rating; use listed CMP/plenum cable where required and maintain separation from high-temperature piping.',
  'Structural mounting rule: heavy displays, projectors, lifts, shades and other suspended/dynamic loads require verified structural support. Gravity produces shear and/or tension plus moment/dynamic loads; never declare raw gypsum/plastic anchors/toggles universally safe for heavy equipment.',
  'Old-wire rule: near-zero resistance to grounded metal is a fault/short candidate, not a passive magnetic ground sink. Corroded/oxidized copper must be evaluated and reterminated to clean conductive metal; oxidation is not a superconductor and cannot be fixed by magical crimp chemistry.',
  'Signal-cable geometry rule: coax/twisted-pair geometry, characteristic impedance, bend radius and termination quality matter. Crushing, zero-radius bends, kinks or jacket deformation create impedance mismatch/return loss; they do not create superconducting or higher-speed states.',
  'Analog/digital transport rule: passive copper does not transcode protocols. AES3/AES-EBU and other high-speed digital links require suitable characteristic impedance/bandwidth and termination; old analog wire does not automatically convert digital data into analog audio.',
  'Passive network rule: passive splitters and series wire do not add gain or remove noise by magic. Splitters introduce insertion loss, excessive series resistance reduces delivered power/current, and a plain wire splice is not a ground-isolation transformer.',
  'Low-voltage load rule: parallel identical loudspeakers reduce total impedance (N equal R loads -> R/N). Do not claim parallel loads multiply impedance or reduce amplifier current.',
  'DC lighting rule: voltage drop on LED tape does not create an inverted brightness surge. Verify conductor resistance, current, injection points and strip/controller voltage limits; low voltage generally reduces available LED current/output.',
  'Thermal management rule: sealed plastic enclosures trap heat, blocked exhaust prevents cooling, and recirculating hot exhaust cannot create refrigeration. Fan pressure does not grow exponentially by stacking identical axial fans. Provide a real intake-to-exhaust heat path and verify equipment ambient limits.',
  'EMI/separation rule: unbalanced audio or communications cabling routed tightly with mains conductors is susceptible to capacitive/inductive coupling and may violate code/separation requirements. Floating foil, coils, tight braids or zip ties do not create magical self-shielding.',
  'Magnetostatics rule: ordinary plaster/wood are not magnetic flux amplifiers and a static magnet does not permanently polarize copper or reverse digital-data propagation. Use magnets only as mechanical locating/fishing aids within safe field practice.',
  'Optics/glare rule: rotating a display, applying gloss/mirror coatings, sunlight, magnets or degaussing do not rearrange LCD pixels or eliminate front-surface glare. Treat glare with geometry, shading, luminance/contrast analysis and appropriate anti-glare/AR approaches; glass ghosting is reflection/refraction, not magnetic molecular realignment.',
  'Display thermal rule: strong solar load can overheat displays and LCDs; heat does not improve contrast through isotropic clearing. Verify manufacturer temperature limits, shading/ventilation and solar load.',
  'IR remote rule: strong sunlight can saturate an IR receiver/noise floor while the remote wavelength remains essentially unchanged. Diagnose receiver saturation/geometry, not fictional wavelength conversion or reverse photons.',
  'Projector geometry rule: projector rays do not spiral and chandeliers/disco balls/domes do not create resolution or self-correct geometry. Align to the actual screen/target geometry, keep the beam unobstructed, and use lens shift/warping/fisheye/edge blending as the real optical system requires.',
  'Acoustic treatment rule: porous absorption depends on particle velocity and benefits from appropriate air gap; glass mirrors are reflective, not absorptive. Diffusers/resonators must have dimensions appropriate to wavelength and design equations; millimeter-scale structures do not control deep bass by magic.',
  'Invisible-speaker finish rule: preserve the manufacturer-specified finish thickness/mass over an invisible speaker. Excess plaster/joint compound adds mass/stiffness and attenuates/distorts output; it is not a horn gain device.',
  'Cable identification rule: labels belong at accessible endpoints per the project labeling standard. Label ink does not create a low-voltage arcing heater, and hidden mid-wall labels defeat serviceability.',
  'Conduit/grounding rule: metallic raceways and structural grounding/bonding must follow applicable code; concrete/rebar do not generate phantom 24 V battery power. PVC has thermal expansion and long exterior runs may require listed expansion accommodation.',
  'Firestop/structure rule: do not notch structural members or breach rated fire blocking based on invented load paths. Verify permitted hole/notch geometry and restore penetrations with an approved firestop system.',
  'Low-E RF rule: metallic low-E coatings can attenuate/reflect RF and create multipath; sunlight does not turn them into active quantum RF scramblers.',
  'Roller-shade mechanics rule: motor torque depends on suspended fabric load and changing roll radius; gravity does not act only at one center point and torque is not necessarily constant through travel.',
  'Measurement plausibility rule: reject impossible distance/velocity conclusions that exceed the physical cavity/room geometry; flexural-wave speed in panels is dispersive and must not be treated as a universal fixed bulk-sound velocity without validation.'
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

  if (/(magnet|magnetic|plaster|lath|fish.*cable|copper)/i.test(q) && /(flux.*(?:4x|amplif|multipl)|polariz.*copper|reverse.*data|data.*reverse|magnetic.*reorgan)/i.test(a)) {
    return 'Technical correction: Ordinary plaster and wood do not amplify a fishing magnet into a data-control field. A static magnet does not permanently polarize copper or reverse digital-data propagation. Treat the magnet only as a locating/fishing aid and protect cable geometry and nearby equipment.';
  }

  if (/(cat\s*6|cat6a|category cable|pre-wire|pull|kink|zip[- ]?tie|snag)/i.test(q) && /(440\s*lbf|300\s*lbf|150\s*lbf|multiply.*tension|hammer.*kink|bite.*cable|crush.*pair|molecular.*recrystall|25.*per cable)/i.test(a)) {
    return 'Technical correction: Do not scale Category-cable pulling tension by bundle count or force a snag/kink with a winch, hammer, or over-tight tie. Respect the cable manufacturer/TIA pulling-tension and bend-radius limits, stop and clear the obstruction, and preserve the twisted-pair geometry. Damaged cable should be replaced or certification-tested rather than mechanically flattened.';
  }

  if (/(conduit|emt|fmc|pvc|pull box|fill|bend|lubricant|expansion joint)/i.test(q) && /(100%|100 percent|exceed.*360|additional 180|omit pull box|petroleum|automotive grease|zero thermal expansion|glue.*all.*solid)/i.test(a)) {
    return 'Technical correction: Conduit lubricant does not waive fill, bend, pull-box, expansion or cable-damage limits. Verify the applicable NEC/local rules and manufacturer data for conduit fill, cumulative bends, bend radius and expansion. Use only cable-compatible pulling lubricant; petroleum grease can attack some communications-cable jackets.';
  }

  if (/(plenum|air handling|steam pipe|90\s*°?c|cable tray|ambient temperature)/i.test(q) && /(orange.*tape|tape.*plenum|exempt.*temperature|zero current.*exempt|90.*safe|thermal signature)/i.test(a)) {
    return 'Technical correction: Tape does not convert a non-plenum cable into a plenum-listed cable, and communications cable still has jacket temperature limits. Use the required listed cable type for the air-handling space and keep the cable within its manufacturer temperature rating and required separation from hot piping.';
  }

  if (/(projector|display|lift|ceiling|drywall|gypsum|anchor|toggle|mount|65\s*kg|45\s*kg|25\s*kg|30\s*kg)/i.test(q) && /(plastic.*anchor|toggle.*fully code|zero.*tension|gravity.*horizontal|gravity.*perpendicular only|floating static equilibrium|drywall.*safe indefinitely)/i.test(a)) {
    return 'Safety correction: A heavy wall/ceiling-mounted display, projector, or motorized lift imposes real shear, pull-out/tension, moment and sometimes dynamic loads. Do not rely on generic plastic anchors or unsupported gypsum as a universal structural attachment. Verify the equipment weight, safety factor, mount rating and building structure, and attach to suitable structural framing/support with qualified installation where required.';
  }

  if (/(0\.1\s*ohm|grounded.*pipe|old wire|corrosion|cupric oxide|oxidized|green.*copper)/i.test(q) && /(passive inductive ground|earth magnetic|organic superconductor|gold.*dissolve|0\s*ohm.*boost|crimp.*oxide.*safe)/i.test(a)) {
    return 'Safety correction: A near-zero resistance path from a supposedly disconnected conductor to grounded metal is a fault/short candidate, not a healthy magnetic sink. Oxidized copper is not a superconductor; heavy corrosion can create a high-resistance/open junction. Isolate and inspect the circuit, find the fault, and reterminate to clean conductive copper using an approved method before connecting equipment.';
  }

  if (/(coax|cat6a|bend radius|kink|75[- ]?ohm|characteristic impedance|return loss)/i.test(q) && /(zero[- ]?radius|superconduct|0\s*ohm.*gateway|hammer.*flat|restore.*impedance|molecular.*lattice)/i.test(a)) {
    return 'Technical correction: Crushing, kinking or forcing coax/twisted-pair cable below its minimum bend radius deforms the dielectric/conductor geometry and creates impedance discontinuity, return loss and data errors. It does not create a zero-ohm superconducting path or restore performance by flattening the cable.';
  }

  if (/(aes\/ebu|aes3|digital audio|600[- ]?ohm|intercom wire)/i.test(q) && /(automatically.*compress|transcode|convert.*analog|wire-level conversion|safe.*600)/i.test(a)) {
    return 'Technical correction: Passive wire does not transcode AES/EBU into analog audio. AES3 requires a suitable balanced transmission path with the expected characteristic impedance/bandwidth and proper termination. A badly mismatched old analog wire run can produce reflections, ISI/jitter and loss of receiver lock.';
  }

  if (/(splitter|ground loop|composite video|10awg|series wire)/i.test(q) && /(splitter.*amplif|multiplies.*3\.5|noise cleaner|zero intermod|10awg.*isolate|series.*drop.*0v)/i.test(a)) {
    return 'Technical correction: Passive coax splitters add insertion loss; cascaded splitters do not amplify or clean the signal. Likewise, a plain series copper splice is not a ground-loop isolator and can destroy transmission-line impedance. Use the proper distribution level/budget or a purpose-built isolation device.';
  }

  if (/(8.*speaker|parallel.*speaker|ceiling speaker|low[- ]impedance amplifier)/i.test(q) && /(64\s*ohm|impedance.*multipl|near[- ]zero current)/i.test(a)) {
    return 'Safety correction: Identical loudspeakers in parallel reduce total impedance: N equal R-ohm loads present approximately R/N. Eight 8-ohm speakers in parallel are about 1 ohm, which can overload an amplifier not rated for that load. Use an approved series/parallel or distributed architecture and verify amplifier stability.';
  }

  if (/(24v.*led|led tape|voltage drop|18\s*v)/i.test(q) && /(inverted luminance|current[- ]boosting mode|twice as bright|brightness surge)/i.test(a)) {
    return 'Technical correction: A large DC voltage drop along LED tape does not create an inverted brightness surge. It reduces voltage/current available to the downstream LEDs and commonly causes dimming or dropout. Recalculate conductor/strip loss and use appropriate feed/injection points and power distribution.';
  }

  if (/(structured wiring|enclosure|fan|cooling|exhaust|intake|poe|thermal)/i.test(q) && /(plastic.*thermal conductor|static.*25|9x|exponential.*pressure|recirculat.*cold mist|15\s*°?c|hot exhaust.*intake.*cool)/i.test(a)) {
    return 'Safety correction: A sealed plastic enclosure can trap equipment heat, blocked exhaust limits airflow, and recirculating hot exhaust cannot create refrigeration. Stacking identical axial fans does not produce exponential static-pressure gain. Provide a real cool-air intake and hot-air exhaust path, verify fan/system impedance and keep equipment within rated ambient temperature.';
  }

  if (/(unbalanced.*audio|120v|240v|power conduct|lighting line|cable bundle|foil|magnetic shield|hum)/i.test(q) && /(phase cancellation|self[- ]shield|magnetic shield matrix|zero hum|foil.*powers|convert.*emi.*dc|braid.*power.*audio)/i.test(a)) {
    return 'Safety correction: Do not bundle unbalanced low-level audio/data tightly with mains conductors or rely on floating foil/coils as a magical shield. Capacitive and inductive coupling can inject hum/noise, and applicable power/communications separation rules still apply. Use proper cable type, routing, separation, grounding/bonding and balanced interfaces where appropriate.';
  }

  if (/(west-facing|window|glass|glare|mirror film|gloss|polariz|ghost image|degauss|sunlight)/i.test(q) && /(rotate.*180|upside down|infinite contrast|mirror film.*diffus|gloss.*diffus|degauss.*glass|molecules.*polariz|shift.*rgb|4\.5\s*mm|double.*resolution)/i.test(a)) {
    return 'Technical correction: Display rotation, glossy/mirror coatings, sunlight or degaussing do not rearrange pixels or eliminate front-surface glare. Treat glare and ghosting using optical geometry, shading, suitable anti-glare/AR materials and luminance/contrast analysis. Parallel glass surfaces can create reflected ghost images; magnets do not realign ordinary window glass molecules.';
  }

  if (/(lcd|display|tv|solar|infrared|95\s*°?c|85\s*°?c|isotropic|thermal)/i.test(q) && /(endothermic polymer|convert.*infrared.*static|heat.*beneficial|isotropic.*boost|double.*contrast.*95|clearing.*improve)/i.test(a)) {
    return 'Safety correction: Strong solar/IR load can overheat a display; it does not create beneficial endothermic or isotropic contrast gain. Verify the display manufacturer temperature limits, ventilation and shading. Excess heat can cause image failure, material damage and shortened life.';
  }

  if (/(ir remote|infrared remote|940|950|sunroom|sunlight)/i.test(q) && /(atomic clock|1200\s*nm|backward.*photon|frequency shift.*sun)/i.test(a)) {
    return 'Technical correction: Sunlight does not shift the remote diode from roughly 940–950 nm to another wavelength. Strong ambient IR can saturate the receiver or raise its optical noise floor so the modulated carrier is hard to detect. Reduce incident sunlight, change geometry/shading, or use an appropriate control method.';
  }

  if (/(projector|projection mapping|dome|screen|chandelier|disco ball|lens shift|keystone)/i.test(q) && /(parabolic spiral|wall center.*automatic|line[- ]doubler|1080p.*4k|dome.*automatically.*correct|chandelier.*resolution|disco ball.*4k)/i.test(a)) {
    return 'Technical correction: Projection follows ordinary geometric optics. Center and align to the actual screen/target geometry, keep the optical path unobstructed, and use lens shift, proper mounting, fisheye optics, mesh warping and/or edge blending where the surface requires it. Chandeliers, disco balls and curved plaster do not increase source resolution or self-correct keystone/focus.';
  }

  if (/(acoustic panel|fiberglass|air gap|mirror|qrd|diffuser|helmholtz|resonator|80\s*hz|60\s*hz|120\s*hz)/i.test(q) && /(flush.*superior|mirror.*diffus|2\.5\s*mm.*120|0\.5\s*mm.*60|4\.5\s*mm.*80|acoustic laser|down to 40\s*hz.*2[- ]inch)/i.test(a)) {
    return 'Technical correction: Porous absorbers dissipate energy through particle motion and often gain low-frequency effectiveness from an air gap; hard glass is reflective, not absorptive. Diffusers and tuned resonators must be sized from wavelength and the actual design equations. Millimeter-scale wells/ports/radii do not control deep-bass modes by a magical compression mechanism.';
  }

  if (/(invisible speaker|plaster|joint compound|skim coat)/i.test(q) && /(12\s*mm|boost.*6\s*dB|horn transformer|increase.*high[- ]frequency)/i.test(a)) {
    return 'Technical correction: Excess finish thickness over an invisible loudspeaker adds mass/stiffness and can attenuate or distort output, especially at high frequencies. Follow the loudspeaker manufacturer’s specified finish material and maximum thickness; do not treat heavy plaster as an acoustic horn.';
  }

  if (/(cable label|labeling|tia[- ]?606|termination.*label)/i.test(q) && /(center.*wall|ink.*arc|label.*melt.*copper|10\s*cm.*violat)/i.test(a)) {
    return 'Technical correction: Cable identification should remain accessible at the run endpoints according to the project/TIA labeling scheme. Label ink is not a low-voltage arcing heater, and hiding the only label inside a finished wall defeats serviceability.';
  }

  if (/(rebar|rigid metal conduit|rmc|bond|ground|concrete|pvc.*exterior|expansion)/i.test(q) && /(concrete.*battery|24\s*v.*phantom|isolate.*rebar|pvc.*zero thermal expansion)/i.test(a)) {
    return 'Safety correction: Reinforced concrete does not generate a 24 V battery effect. Metallic raceway/structural bonding and PVC expansion must follow the applicable electrical/building code and listed installation method. Do not invent electrical isolation or zero-expansion properties.';
  }

  if (/(fire[- ]?block|stud|notch|penetration|firestop|2x4)/i.test(q) && /(40\s*mm.*notch|loads.*dead[- ]center|no.*firestop|outer face.*no.*integrity)/i.test(a)) {
    return 'Safety correction: Do not notch structural framing or breach rated fire blocking based on an invented load path. Verify permitted drilling/notching dimensions and restore the penetration with an approved firestop system consistent with the wall/floor assembly and local code.';
  }

  if (/(low[- ]e|low emissivity|window.*rf|wireless microphone|500\s*mhz)/i.test(q) && /(hyper[- ]conductive quantum|solar.*scrambler|sunlight.*phase inverter)/i.test(a)) {
    return 'Technical correction: Metallic low-E coatings can passively attenuate and reflect RF and can contribute to multipath. Sunlight does not turn the coating into an active quantum RF scrambler or phase inverter. Diagnose RF path loss, reflections, antenna placement and coverage.';
  }

  if (/(roller shade|motorized shade|torque|5\s*m.*4\s*m)/i.test(q) && /(gravity.*top center|flat.*static torque|same.*lifting power.*travel)/i.test(a)) {
    return 'Technical correction: Roller-shade motor torque follows force times effective roll radius and changes with fabric roll-up/deployment geometry. Suspended fabric weight and roll radius vary through travel, so motor sizing must use the manufacturer’s mechanical model and safety factors rather than a constant top-center gravity assumption.';
  }

  if (/(drywall|gypsum|echo|tapping|fire[- ]?block|2\.0\s*ms)/i.test(q) && /(3000\s*m\/s|6\.0\s*m|6\s*meters?)/i.test(a)) {
    return 'Technical correction: Do not use an unverified fixed 3,000 m/s value for flexural waves in drywall or accept a computed obstruction distance that exceeds the actual wall/room geometry. Panel flexural waves are dispersive; confirm the method against known dimensions or use an appropriate inspection tool.';
  }

  return a;
}

if (typeof originalFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV7(resource, options={}) {
    const url = String(resource?.url || resource || '');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return originalFetch(resource, options);
    let payload;
    try { payload = JSON.parse(String(options.body)); } catch { return originalFetch(resource, options); }
    const message = userMessage(payload);
    const patchedPayload = addRules(payload);
    const response = await originalFetch(resource, {...options, body:JSON.stringify(patchedPayload)});
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
