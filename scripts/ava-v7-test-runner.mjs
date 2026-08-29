import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, 'ava-technical-safety-v7-self-test.mjs');
const runtimePath = path.join(here, '.ava-technical-safety-v8-runtime-test.mjs');

let source = await fs.readFile(sourcePath, 'utf8');
source = source.replace(
  "import {applyAvaTechnicalSafetyV7, AVA_TECHNICAL_RULES_V7} from '../ava-technical-safety-v7-preload.mjs';",
  "import {applyAvaTechnicalSafetyV8 as applyAvaTechnicalSafetyV7, AVA_TECHNICAL_RULES_V8 as AVA_TECHNICAL_RULES_V7} from '../ava-technical-safety-v8-preload.mjs';"
);
source = source.replace(
  "const must=(n,c)=>{if(!c)throw new Error(`FAIL: ${n}`); console.log(`PASS: ${n}`)};",
  "const __fails=[]; const must=(n,c)=>{if(!c){console.error(`FAIL: ${n}`);__fails.push(n)}else console.log(`PASS: ${n}`)};"
);
const oldMarker = "must('V7 field rules loaded', /Field cable handling rule/.test(AVA_TECHNICAL_RULES_V7) && /Structural mounting rule/.test(AVA_TECHNICAL_RULES_V7) && /Projector geometry rule/.test(AVA_TECHNICAL_RULES_V7));";
const newMarker = "must('V8 field rules loaded', /Field release hardening/.test(AVA_TECHNICAL_RULES_V7));";
if (!source.includes(oldMarker)) throw new Error('V8_TEST_RUNNER_MARKER_NOT_FOUND');
source = source.replace(oldMarker, newMarker);
source += "\nif (__fails.length) throw new Error('V8_FULL_SWEEP_FAILURES: '+__fails.join(', '));\n";
await fs.writeFile(runtimePath, source, 'utf8');
try {
  await import(pathToFileURL(runtimePath).href + `?t=${Date.now()}`);
} finally {
  await fs.rm(runtimePath, { force: true });
}
