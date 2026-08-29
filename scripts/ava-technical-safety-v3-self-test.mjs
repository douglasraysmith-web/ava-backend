import { applyAvaTechnicalSafetyV3, AVA_TECHNICAL_RULES_V3 } from '../ava-technical-safety-v3-preload.mjs';

function must(name, condition) {
  if (!condition) throw new Error(`FAIL: ${name}`);
  console.log(`PASS: ${name}`);
}

must('rules include 70V line-drop power relationship', /70V line-drop rule/.test(AVA_TECHNICAL_RULES_V3) && /31% less power/i.test(AVA_TECHNICAL_RULES_V3));

const p48 = applyAvaTechnicalSafetyV3(
  'A 70V speaker line measures a 12 Volt AC drop from the amplifier end to the last speaker under load. The audio is thin and distorted. Is that negligible?',
  'Yes, the technician is correct. A 12-Volt drop is less than a 17% voltage variance and is negligible on a 70V system. The thin sound must be a bad amplifier output stage or blown speaker rather than the wire run.'
);
must('P48 12V drop is not dismissed', /12 V drop.*large enough to matter/i.test(p48));
must('P48 square-law delivered-power consequence present', /roughly a 31% reduction/i.test(p48) && /\(58\/70\)\^2/i.test(p48));
must('P48 line-loss diagnostics required', /conductor gauge/i.test(p48) && /terminations\/splices/i.test(p48) && /summed transformer taps/i.test(p48));

const safeLineDrop = 'A 12 V drop from 70 V to 58 V is significant. Under a fixed equivalent load the downstream power is about (58/70)^2, or roughly 69% of nominal. Verify the AC measurement conditions, wire gauge/length, terminations, and tap loading before blaming the amplifier or speakers.';
must('correct 70V line-drop answer is not rewritten', applyAvaTechnicalSafetyV3('70V line has a measured 12V drop under load', safeLineDrop) === safeLineDrop);

console.log('AVA technical safety V3 self-test passed.');
