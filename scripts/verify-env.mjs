const requiredForOwnerPilot = ['AVA_OWNER_TOKEN'];
const optionalProvider = ['OPENAI_API_KEY','OPENAI_MODEL'];
const dbKeys = ['DATABASE_URL'];
const safetyOff = ['AVA_ENABLE_CUSTOMER_DATA','AVA_ENABLE_FILE_RETRIEVAL','AVA_ENABLE_CODE_BANK','AVA_ENABLE_VOICE','AVA_ALLOW_PAYMENT','AVA_ALLOW_HARDWARE_CONTROL'];
const bool = name => String(process.env[name] || '').toLowerCase() === 'true';
const missing = requiredForOwnerPilot.filter(k => !process.env[k]);
const enabledSensitive = safetyOff.filter(bool);
const report = {
  ok: missing.length === 0 && !enabledSensitive.includes('AVA_ALLOW_PAYMENT') && !enabledSensitive.includes('AVA_ALLOW_HARDWARE_CONTROL'),
  requiredMissing: missing,
  databaseConfigured: dbKeys.every(k => !!process.env[k]),
  providerConfigured: optionalProvider.every(k => !!process.env[k]),
  sensitiveFlagsEnabled: enabledSensitive,
  note: 'Customer/file/code/voice flags may be enabled only after owner approval and readiness checks. Payment and hardware control stay off in this pilot.'
};
console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exit(2);
if (bool('AVA_ALLOW_PAYMENT') || bool('AVA_ALLOW_HARDWARE_CONTROL')) process.exit(3);
