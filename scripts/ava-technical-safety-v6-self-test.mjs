import {applyAvaTechnicalSafetyV6, AVA_TECHNICAL_RULES_V6} from '../ava-technical-safety-v6-preload.mjs';
const must=(n,c)=>{if(!c)throw new Error(`FAIL: ${n}`); console.log(`PASS: ${n}`)};

must('V6 rules loaded', /HDBaseT rule/.test(AVA_TECHNICAL_RULES_V6) && /Optical link-budget rule/.test(AVA_TECHNICAL_RULES_V6));

must('P122 HDBaseT 24Gbps/thermal fiction blocked', /10\.2 Gbps-class/i.test(applyAvaTechnicalSafetyV6('HDBaseT Spec 2.0 4K60 10-bit 4:4:4 over Cat6A','Spec 2.0 carries 24 Gbps and flashing comes from RJ45 pins heating by 4.5 ohms.')));
must('P127 USB equalizer inversion blocked', /Skin effect concentrates high-frequency current density toward the conductor surface/i.test(applyAvaTechnicalSafetyV6('USB 3.2 Gen 2 CTLE DFE skin effect','Skin effect pushes electrons to the center. CTLE is a digital low-pass and DFE is an analog phase-locked loop.')));
must('P131 AES67 250us packet math/PTP fiction blocked', /12 samples per packet/i.test(applyAvaTechnicalSafetyV6('AES67 48kHz 250 microsecond packet with PTPv2 to PTPv1','Use 120 samples and let the unmanaged switch perform PTP header compression.')));
must('P132 integer scaling handled as integer', /exact 3\.0x integer scale factors/i.test(applyAvaTechnicalSafetyV6('Scale 1920x1080 to 5760x3240 for pixel-perfect text','300 percent is fractional and bilinear splits each source pixel across 3 physical pixels to eliminate aliasing.')));
must('P134 electrical tape EMI shield blocked', /not electromagnetic shielding/i.test(applyAvaTechnicalSafetyV6('HDBaseT Cat6 bundle beside strobe lighting EMI','Wrap the bundle in vinyl electrical tape to shield the magnetic vacuum.')));
must('P136 fabricated d-over-2 directivity boundary blocked', /fabricated d\/2 low-frequency directivity boundary/i.test(applyAvaTechnicalSafetyV6('Line array 0.35 m module spacing and 6 degree splay','Use d/2 as the low-frequency directivity threshold, which is 1960 Hz; below that it is cylindrical.')));
must('P137 axial mode formula/null boost blocked', /first-order fundamental is c\/\(2L\)/i.test(applyAvaTechnicalSafetyV6('7.5m room axial mode with deep modal null','Use f=v/L so 343/7.5=45.73 Hz and boost the null +12 dB.')));
must('P138 optical budget sign corrected', /remaining margin is 9\.4 dB/i.test(applyAvaTechnicalSafetyV6('Fiber optical link budget 16 dB available and 6.6 dB insertion loss','Add the loss to the budget: 16 dB + 6.6 dB = 22.6 dB margin.')));

const safe='At 48 kHz and 250 microseconds the payload is 12 samples, and an unmanaged switch does not translate PTP timing profiles.';
must('correct AES67 answer not rewritten', applyAvaTechnicalSafetyV6('AES67 48kHz 250us',safe)===safe);
console.log('AVA technical safety V6 self-test passed.');
