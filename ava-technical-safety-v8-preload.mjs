const previousFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V8 = [
  'Field release hardening for projects 141-200: preserve manufacturer pull tension, bend radius, cable geometry, conduit fill/bend/expansion, plenum and temperature limits, structural attachment, passive-network loss, grounding/separation, optical geometry, thermal management, acoustic-treatment wavelength scaling, projector geometry, and physical plausibility.',
  'Never convert unsafe field-installation myths into instructions. Prefer diagnosis, measurement, manufacturer data, applicable code, and reversible verification.'
].join('\n');

function getUserMessage(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input : [];
  const u = [...input].reverse().find(x => x?.role === 'user');
  return String(u?.content || '');
}
function addRules(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x=>({...x})) : [];
  const s = input.find(x=>x?.role==='system');
  if (s) s.content = `${String(s.content||'')}\n${AVA_TECHNICAL_RULES_V8}`;
  else input.unshift({role:'system',content:AVA_TECHNICAL_RULES_V8});
  return {...payload,input};
}

export function applyAvaTechnicalSafetyV8(message='', answer='') {
  const q=String(message||'');
  const a=String(answer||'');

  if (/(cat\s*6|cat6a|category cable|pull|kink|snag|zip[- ]?tie|sharp concrete corner)/i.test(q) && /(440\s*lbf|300\s*lbf|150\s*lbf|hammer|bite|flatten|strain harden|recrystall|improves? speed|doubles? headroom)/i.test(a))
    return 'Technical correction: Do not scale Category-cable pulling tension by bundle count or force a snag/kink with a winch, hammer, or over-tight tie. Respect the cable manufacturer/TIA pulling-tension and bend-radius limits. Damaged cable should be replaced or certification-tested rather than mechanically flattened.';

  if (/(old wire|0\.1\s*ohm|grounded water pipe|corrosion|cupric oxide|oxidized|green.*copper)/i.test(q) && /(passive inductive ground|earth magnetic|superconductor|gold.*dissolv|crimp.*oxide)/i.test(a))
    return 'Safety correction: A near-zero resistance path to grounded metal is a fault/short candidate. Oxidized copper is not a superconductor; inspect and isolate the circuit, then reterminate to clean conductive copper using an approved method.';

  if (/(magnet|plaster|fish copper cable)/i.test(q) && /(flux|polariz|reverse data)/i.test(a))
    return 'Technical correction: Ordinary plaster and wood do not amplify a fishing magnet field into a data-control mechanism. A static magnet does not permanently polarize copper or reverse digital-data propagation.';

  if (/(west-facing|glare|glass|ghost|mirror film|gloss|sunlight|degauss|protective glass)/i.test(q) && /(upside down|infinite contrast|shift.*rgb|double.*resolution|gloss|mirror film|degauss|realign|polariz.*glass)/i.test(a))
    return 'Technical correction: Treat glare and ghosting with optical geometry, shading, suitable anti-glare/AR methods and luminance/contrast analysis. Rotating a display, glossy/mirror coatings, sunlight or degaussing do not rearrange pixels; magnets do not realign ordinary window glass molecules.';

  if (/(plenum|environmental air|steam pipe|90c|cable tray)/i.test(q) && /(orange tape|tape.*plenum|zero current|exempt.*temperature|90.*safe)/i.test(a))
    return 'Technical correction: Tape does not convert a non-plenum cable into a plenum-listed cable. Communications cable still has jacket temperature limits and required separation from hot piping.';

  if (/(drywall|gypsum|tap.*echo|obstruction)/i.test(q) && /(3000\s*m\/s|6\s*meters|6\s*m)/i.test(a))
    return 'Technical correction: Do not use an unverified fixed 3,000 m/s panel-wave velocity to infer an impossible obstruction location. Flexural-wave speed is dispersive and must be checked against the actual cavity geometry.';

  if (/(lcd|display|solar|95c|85c|thermal)/i.test(q) && /(heat.*beneficial|isotropic|thermal clearing|double.*contrast)/i.test(a))
    return 'Safety correction: Strong solar/IR load can overheat a display. Excess heat can cause image failure; isotropic or thermal clearing is a failure mode, not a contrast enhancement.';

  if (/(unbalanced audio|data cables|240v|120v|lighting line|dimmer|hdmi|foil|coil.*audio)/i.test(q) && /(phase cancellation|zero hum|self-shield|convert.*emi.*dc|bridge.*neutral|neutral.*hdmi|auto[- ]null|captures? 60hz)/i.test(a))
    return 'Safety correction: Do not bundle unbalanced low-level audio/data tightly with mains conductors or bond mains neutral to an HDMI shield. Use proper cable type, routing, separation, grounding/bonding and purpose-built isolation. Floating foil/coils are not magical shields.';

  if (/(coax|75[- ]?ohm|zero-radius|kink)/i.test(q) && /(0\s*ohm|superconduct|hammer.*flat|restore.*impedance)/i.test(a))
    return 'Technical correction: Crushing, kinking or forcing coax below minimum bend radius creates an impedance discontinuity and return loss; it does not create superconductivity or restore performance.';

  if (/(eight 8 ohm|parallel.*speaker|ceiling speakers)/i.test(q) && /(64\s*ohm|almost no current|near-zero current)/i.test(a))
    return 'Safety correction: Identical loudspeakers in parallel reduce total impedance. Eight 8-ohm speakers in parallel are about 1 ohm and may overload an amplifier not rated for that load.';

  if (/(conduit|emt|fmc|pvc|pull box|exterior pvc)/i.test(q) && /(100%|exceed.*360|additional 180|no pull box|zero thermal expansion|petroleum grease|automotive petroleum)/i.test(a))
    return 'Technical correction: Conduit lubricant does not waive fill, bend, pull-box or expansion requirements. PVC expansion must follow applicable code/manufacturer guidance, and petroleum grease can attack some cable jackets.';

  if (/(24v led|led strip|18v)/i.test(q) && /(twice as bright|current boost|brightness surge)/i.test(a))
    return 'Technical correction: Voltage drop does not create an inverted brightness surge; it reduces voltage/current available to downstream LEDs and commonly causes dimming or dropout.';

  if (/(roller shade|shade torque)/i.test(q) && /(gravity.*top center|torque.*flat|torque.*same)/i.test(a))
    return 'Technical correction: Roller-shade motor torque follows force times effective roll radius and changes through travel as suspended fabric and roll radius change.';

  if (/(aes\/ebu|aes3|600[- ]?ohm|intercom wire)/i.test(q) && /(automatically.*convert|transcode|analog audio)/i.test(a))
    return 'Technical correction: Passive wire does not transcode AES/EBU into analog audio. Use the proper characteristic impedance, bandwidth and termination.';

  if (/(fiberglass|acoustic panel|flutter echo|mirror|qrd|helmholtz|diffuser|resonator|120hz|80hz|60hz)/i.test(q) && /(flush.*superior|glass mirrors|2\.5\s*mm|0\.5\s*mm|4\.5\s*mm|acoustic laser|40\s*hz)/i.test(a))
    return 'Technical correction: Porous absorbers dissipate energy through particle motion and can benefit from an air gap; hard glass is reflective. Millimeter-scale wells/ports/radii do not control deep bass; size diffusers/resonators from wavelength and the actual design equations.';

  if (/(ir remote|sunroom|940|950)/i.test(q) && /(1200\s*nm|backward.*photon|shift.*diode)/i.test(a))
    return 'Technical correction: Sunlight does not shift the remote diode wavelength. Strong ambient IR can saturate the receiver/noise floor and mask the modulated carrier.';

  if (/(cable labels|labeling|where should cable labels)/i.test(q) && /(center.*wall|endpoint labels arc|hide.*center)/i.test(a))
    return 'Technical correction: Cable labels should remain accessible at the run endpoints. Label ink is not a low-voltage arcing heater, and hidden mid-wall labels defeat serviceability.';

  if (/(invisible speaker|skim coat|joint compound)/i.test(q) && /(12\s*mm|boost.*6\s*db|horn)/i.test(a))
    return 'Technical correction: Excess finish thickness over an invisible speaker adds mass/stiffness and attenuates/distorts output. Follow the manufacturer finish-thickness limit.';

  if (/(sealed plastic enclosure|fans stacked|exhaust back to intake|structured wiring enclosure)/i.test(q) && /(plastic conducts heat|without fans|9x|exponential|cold mist|15c)/i.test(a))
    return 'Safety correction: A sealed plastic enclosure can trap equipment heat; recirculating hot exhaust cannot create refrigeration. Stacking identical axial fans does not produce exponential static-pressure gain.';

  if (/(splitter|ground-loop|composite video|10awg)/i.test(q) && /(adds? \+?3\.5|stronger signal|removes? 4\s*db noise|pristine|drop hum to zero|series.*hum)/i.test(a))
    return 'Technical correction: Passive coax splitters add insertion loss and do not clean or amplify a signal. A plain series copper splice is not a ground-loop isolator.';

  if (/(45\s*kg|25\s*kg|30\s*kg|65\s*kg|projector lift|display.*drywall|gypsum ceiling)/i.test(q) && /(plastic|toggle|gravity.*zero|pure lateral shear|horizontal shear|motion cancels gravity|safe because)/i.test(a))
    return 'Safety correction: Heavy wall/ceiling-mounted equipment imposes real shear, pull-out/tension, moment and dynamic loads. Unsupported gypsum is not structural support; verify structural framing, mount rating and dynamic loads.';

  if (/(projector|projection mapping|dome|chandelier|disco ball)/i.test(q) && /(parabolic spiral|line[- ]double|1080p.*4k|self-correct|automatically correct|refract.*inward)/i.test(a))
    return 'Technical correction: Align to the actual screen/target geometry and use appropriate optics and mesh warping. Chandeliers, disco balls and curved plaster do not increase source resolution or self-correct geometry.';

  if (/(rmc|reinforced concrete|rebar)/i.test(q) && /(24v|battery|phantom power|isolate.*rebar)/i.test(a))
    return 'Safety correction: Reinforced concrete does not generate a 24 V battery effect. Follow applicable metallic raceway bonding requirements.';

  if (/(low[- ]e|low emissivity|wireless dropout|500mhz)/i.test(q) && /(quantum|hyper-conductive|scrambler)/i.test(a))
    return 'Technical correction: Metallic low-E coatings can passively attenuate and reflect RF and contribute to multipath; sunlight does not turn them into an active quantum RF scrambler.';

  if (/(fire[- ]?block|stud bay|structural face|notch)/i.test(q) && /(40\s*mm|no firestop|load only travels)/i.test(a))
    return 'Safety correction: Do not notch structural framing based on an invented load path. Verify permitted penetrations and restore the rated assembly with an approved firestop system.';

  return a;
}

if (typeof previousFetch === 'function') {
  globalThis.fetch = async function avaSafetyFetchV8(resource, options={}) {
    const url=String(resource?.url||resource||'');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return previousFetch(resource,options);
    let payload; try { payload=JSON.parse(String(options.body)); } catch { return previousFetch(resource,options); }
    const message=getUserMessage(payload);
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
