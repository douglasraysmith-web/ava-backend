import { readFileSync } from 'node:fs';
console.log(readFileSync(new URL('../migrations/001_ava_core_railway_postgres.sql', import.meta.url), 'utf8'));
