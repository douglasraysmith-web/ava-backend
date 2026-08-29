import { applyAvaTechnicalSafetyV2, AVA_TECHNICAL_RULES_V2 } from '../ava-technical-safety-preload.mjs';

function must(name, condition) {
  if (!condition) throw new Error(`FAIL: ${name}`);
  console.log(`PASS: ${name}`);
}

must('rules include fiber transport coupling', /Fiber-distance rule/.test(AVA_TECHNICAL_RULES_V2));
must('rules include video conversion mechanism caution', /Video-conversion rule/.test(AVA_TECHNICAL_RULES_V2));
must('rules include 70V impedance interpretation', /70V impedance rule/.test(AVA_TECHNICAL_RULES_V2));
must('rules distinguish DMM DC resistance from AC load', /digital multimeter reading.*DC resistance/i.test(AVA_TECHNICAL_RULES_V2));
must('rules include local speech reinforcement caution', /Local speech reinforcement rule/.test(AVA_TECHNICAL_RULES_V2));

const p13 = applyAvaTechnicalSafetyV2(
  'Our 450 meter OM3 fiber link carries a standard Dante 1Gbps network and loses PTP intermittently.',
  'OM3 has an absolute maximum distance of 300 meters, so the run is too long and must be replaced with OS2.'
);
must('P13 absolute OM3=300m claim corrected', /1000BASE-SX/i.test(p13) && /550 m/i.test(p13));

const p14 = applyAvaTechnicalSafetyV2(
  'A 4K surgical source is cross-converted through 3G-SDI to a Teams USB capture device and video is a slideshow.',
  'The converter drops 3 out of every 4 frames because 3G-SDI cannot carry 4K. Upgrade to 12G-SDI.'
);
must('P14 false converter frame-drop mechanism corrected', /USB 3\.x versus USB 2\.0/i.test(p14));

const p17 = applyAvaTechnicalSafetyV2(
  'A 70V paging line measures 12.5 ohms with a proper AC impedance meter and the amplifier shows a red fault light.',
  '12.5 ohms is perfectly healthy. The problem must be a direct copper short on the new branch.'
);
must('P17 12.5-ohm AC-load interpretation corrected', /about 392 W/i.test(p17));
must('P17 direct-short inference rejected', /near-zero resistance/i.test(p17));

const p19 = applyAvaTechnicalSafetyV2(
  'Council members at one long desk cannot hear the adjacent person clearly. The DSP uses mix-minus zoning.',
  'Set the Neighbor Zone cross-point to unity so the adjacent microphone feeds the overhead ceiling speaker.'
);
must('P19 neighbor-overhead default corrected', /local feedback path/i.test(p19) && /automixer\/gating threshold/i.test(p19));

const p10 = applyAvaTechnicalSafetyV2(
  'A 70V distributed audio amplifier keeps shutting down into protection.',
  'Check for a short, then upgrade to a larger 750W amplifier so it stops tripping.'
);
must('P10 mixed diagnose-then-upsize still blocked', !/then upgrade to a larger 750W amplifier/i.test(p10) && /Do not increase amplifier power/i.test(p10));

const p28 = applyAvaTechnicalSafetyV2(
  'A technician measured 4.2 Ohms DC resistance on a 70V transformer-coupled speaker line using a standard digital multimeter. How many watts will the amplifier draw, and is the line safe to energize?',
  'Use W = V^2/R: 4900 / 4.2 = 1,166 watts. The line will draw 1,166 watts, so disconnect speakers until the reading is safe.'
);
must('P28 DMM resistance is not converted to operating watts', /Do not calculate 70V operating wattage/i.test(p28) && /DMM measures DC resistance/i.test(p28));
must('P28 requires AC load method before safety conclusion', /impedance meter\/bridge|manufacturer-approved distributed-line test method/i.test(p28) && /do not declare the line safe or overloaded from DCR alone/i.test(p28));

const safeFiber = 'This is a 10GBASE-SR OM3 link at 250 m, which is within the supported design distance; verify optics and cleanliness next.';
must('safe fiber answer is not rewritten', applyAvaTechnicalSafetyV2('10GBASE-SR OM3 link at 250 m', safeFiber) === safeFiber);

const safe70V = 'The 70V amplifier is in protection. Sum transformer taps, isolate branches, and verify wiring before changing amplifier size.';
must('safe 70V answer is not rewritten', applyAvaTechnicalSafetyV2('70V amplifier is in protection', safe70V) === safe70V);

const safeDmm = 'A standard multimeter reads DC resistance, not the operating AC impedance of a transformer-coupled 70V line. Do not calculate wattage from the 4.2-ohm DCR; verify tap totals or use the approved AC load measurement method.';
must('correct DMM/70V explanation is not rewritten', applyAvaTechnicalSafetyV2('70V speaker line measures 4.2 ohms on a digital multimeter', safeDmm) === safeDmm);

console.log('AVA technical safety V2 self-test passed.');
