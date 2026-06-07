export const AVA_VERSION = '7.8.4';
export const TEACHING_LESSONS = [
  'verified-knowledge-only','free-material-source-map-purpose','library-of-congress-free-use','project-gutenberg-source','internet-archive-caution','wikisource-source','librivox-source','church-religious-library-sources','publishing-platform-study-core','better-than-platforms-rule','superseding-knowledge-filter','source-bank-future-use','ava-backup-for-arche','ava-does-not-become-arche','rights-check-before-reuse','platform-structure-not-copying','public-safe-backup-help-only','keep-source-locations-for-future-reference'
];

export const TEACHING_GUARDRAILS = {
  avaPrimaryRole: 'AV/home-theater intelligence for mtthorne.com/AV/AVA',
  archeRelationship: 'ArchE remains site-wide supervisor; Ava may provide public-safe backup help only when ArchE is unavailable or routes AV work to Ava.',
  activeLearningRule: 'Do not ingest blindly. Activate only verified, useful, public-safe, rights-clear knowledge that improves Ava.',
  rightsRule: 'Free to view is not free to reuse. If rights are unclear, keep as proposed reference only.',
  publicMemoryRule: 'Do not store secrets, raw private source packets, private project records, customer records, payment records, or unclear-rights full works in public-facing memory.',
  copyRule: 'Learn structure, workflows, source locations, rights notes, and support patterns; do not copy copyrighted works, competitor text, platform help text, branding, logos, UI trade dress, or private material.'
};

export function teachingStatus(env = process.env) {
  const storageApproved = String(env.AVA_STORAGE_APPROVED_SYSTEM || '').toLowerCase() === 'true';
  const storageEnabled = String(env.AVA_STORAGE_ENABLED || '').toLowerCase() === 'true';
  return {
    version: AVA_VERSION,
    mode: 'verified_source_teaching_core',
    liveTeachingEndpoint: true,
    ownerOnlyWrite: true,
    publicTeachingWritesAllowed: false,
    databaseConfigured: !!env.DATABASE_URL,
    persistentTeachingActive: storageEnabled && storageApproved && !!env.DATABASE_URL,
    publicSafeBackupAllowed: true,
    avaDoesNotBecomeArchE: true,
    lessonCount: TEACHING_LESSONS.length,
    lessons: TEACHING_LESSONS,
    guardrails: TEACHING_GUARDRAILS
  };
}

export function evaluateTeachingCandidate(record = {}) {
  const text = JSON.stringify(record || {}).toLowerCase();
  const rejected = [];
  if (/(api[_-]?key|owner[_-]?token|database_url|service_role|secret|password|private key)/i.test(text)) rejected.push('possible_secret_or_token');
  if (/full text|entire book|complete scan|copy the whole|verbatim platform terms|competitor wording/i.test(text)) rejected.push('possible_copyright_or_competitor_copying');
  if (/(customer phone|customer address|private project|payment record|raw source packet)/i.test(text)) rejected.push('private_or_customer_record_risk');
  const sourceAuthority = record.authority_level || record.source_authority || 'proposed';
  const rightsStatus = record.rights_status || record.reuse_status || 'unknown';
  const lifecycle = rejected.length ? 'rejected' : (String(rightsStatus).match(/clear|public|open|cc|official/i) && String(sourceAuthority).match(/official|primary|authoritative|verified/i) ? 'active_candidate' : 'proposed_reference');
  return {
    acceptedForWrite: rejected.length === 0,
    activationStatus: lifecycle,
    rejectedReasons: rejected,
    requiredBeforeActive: ['authority_checked','rights_checked','reuse_limits_recorded','verification_date_set','public_private_boundary_checked'],
    note: rejected.length ? 'Teaching candidate blocked or must be manually cleaned before storing.' : 'Teaching candidate may be stored as proposed/active candidate depending on authority and rights proof.'
  };
}

export const CANONICAL_PUBLIC_PATH = '/AV/AVA';

export const AVA_IDENTITY = {
  name: 'Ava',
  system: 'AV.AI',
  role: 'visible AV-side AI assistant and supervisor for mtthorne.com/AV/AVA',
  forte: 'audio/video, home theater, system design, troubleshooting, source lookup, proposal support, diagnostics, and commissioning',
  boundary: 'Ava is not ArchE renamed. ArchE may route AV requests to Ava; Ava owns the AV zone once the request belongs there.'
};

export const MEMORY_BANKS = [
  'customer_bank','project_bank','room_acoustics_bank','device_bank','signal_chain_bank','source_vault','file_vault','proposal_bank','diagnostics_commissioning_bank','code_command_bank','correction_ledger','audit_log','teaching_ledger','verified_source_registry','public_safe_backup_bank'
];

export const KNOWLEDGE_TAXONOMY = {
  displays_video: ['TVs','projectors','screens','throw distance','brightness','HDR','resolution','viewing distance','HDMI','eARC','HDCP','CEC','EDID','matrices','splitters'],
  audio: ['speaker layout','center clarity','subwoofer placement','room modes','bass management','Atmos','DTS:X','calibration basics','SPL','phase','crossover'],
  room_acoustics: ['room dimensions','seating','reflection points','absorption','diffusion','isolation','noise floor','lighting control'],
  control_networking: ['remotes','control systems','Wi-Fi','Ethernet','streaming devices','IP control','firmware','device discovery'],
  workflows: ['intake','unknown-answer follow-up','proposal paths','change orders','commissioning','six-week follow-up'],
  safety_limits: ['electrical/load concerns','wall mounting','attic/crawlspace risk','low-voltage boundaries','code/licensing referrals']
};

const phoneRx = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}/g;
const emailRx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

export function redactCustomerData(text='') {
  return String(text || '').replace(emailRx,'[email_redacted]').replace(phoneRx,'[phone_redacted]');
}

export function classifyIntent(message='') {
  const t = String(message || '').toLowerCase();
  if (/what does av mean|define av|audio[\/-]?video|what is av/.test(t)) return 'definition';
  if (/no sound|no audio|picture but no sound|earc|arc|hdmi handshake|hdcp|cec|input|remote won't|projector.*image|weak bass|subwoofer/.test(t)) return 'troubleshooting';
  if (/plan|theater|cinema|room|screen size|projector throw|speaker layout|atmos|budget/.test(t)) return 'planning';
  if (/driver|protocol|rs-232|rs232|ip control|ir code|command|control4|crestron|savant|rti|urc|lutron/.test(t)) return 'driver_source_lookup';
  if (/quote|proposal|bid|estimate|client|customer|intake|lead/.test(t)) return 'intake_proposal';
  if (/store|save|remember|customer|address|phone|email|record/.test(t)) return 'memory_or_customer_data';
  if (/run command|execute|terminal|script|computer|sandbox|e2b|parse file/.test(t)) return 'owner_computer';
  return 'general_av';
}

export function answerShape(answer, why, next, cta='') {
  return `Direct answer:\n${answer}\n\nWhy it matters:\n${why}\n\nSafest next step:\n${next}${cta ? `\n\nOptional owner/business CTA:\n${cta}` : ''}`;
}

export function fastAnswer(message='', mode='public') {
  const intent = classifyIntent(message);
  if (intent === 'definition') return answerShape(
    'AV means audio/video. On mtthorne.com, Ava uses AV to mean the home-theater and media-system side: sound, display, wiring, control, setup, troubleshooting, and proposal guidance.',
    'A clear definition keeps the visitor in the right zone: publishing and general site questions go elsewhere, while AV questions belong with Ava.',
    'Tell Ava what you are trying to watch, hear, fix, or build. One sentence is enough to begin.'
  );
  if (intent === 'troubleshooting') return answerShape(
    'Start by isolating the signal path: source device, cable, receiver/processor, display/projector, speakers/subwoofer, and control settings. Do not change hidden service settings yet.',
    'Most AV failures are not one broken device. They are often input selection, HDMI/eARC negotiation, power state, cable path, firmware, or a setting mismatch.',
    'Check one known-working source through the simplest path first. Then tell Ava the source device, receiver/processor model, display/projector model, and what changed recently.'
  );
  if (intent === 'planning') return answerShape(
    'A strong theater plan starts with the room, not the shopping cart: dimensions, seating, screen/display goal, speaker layout, subwoofer strategy, lighting, wiring path, rack location, and control method.',
    'The room and signal chain decide whether expensive equipment performs beautifully or becomes a costly compromise.',
    'Provide room length, width, height, seating distance, display preference, rough budget range, and whether the room is dedicated or shared. Unknown answers are allowed.'
  );
  if (intent === 'driver_source_lookup') return answerShape(
    'Ava can prepare the driver/source lookup path now. A field-ready answer requires exact manufacturer, exact model, target control platform, source authority, access requirement, control method, and test status.',
    'Driver and command mistakes can waste hours or break confidence. Ava must not claim a driver, protocol, or command is ready unless the evidence supports it.',
    'Give Ava the brand, exact model, device category, and target platform such as Control4, Crestron, RTI, URC, Savant, Q-SYS, Home Assistant, or manual/IR.'
  );
  if (intent === 'intake_proposal') return answerShape(
    'Ava can start a proposal-ready intake by collecting wants, unknowns, room facts, current equipment, pain points, budget direction, and decision priorities.',
    'A good proposal is faster when the first conversation captures what matters instead of forcing the owner to rediscover the project later.',
    'Use the intake path. Ava should collect only what is needed and should not store customer information unless the approved secure storage flow is active.'
  );
  if (intent === 'memory_or_customer_data') return answerShape(
    'Ava must not casually retain customer details in public chat. Customer information belongs only in approved, secured, persistent, auditable storage with owner approval.',
    'That protects customers, the owner, and the business while still allowing Ava to become fast and useful once the right storage is connected.',
    mode === 'owner' ? 'Use the owner-only ingest route after storage is configured and approved.' : 'Ask Ava for general guidance now, or use the approved contact/intake flow once enabled.'
  );
  if (intent === 'owner_computer') return answerShape(
    'Ava’s virtual computer is owner-only. Public users cannot run commands, scripts, hardware actions, or sandbox tasks through Ava.',
    'Command routes can affect files, data, cost, or security. Ava must keep them token-gated, audited, and disabled until approved.',
    'For now, Ava can create a safe work plan. Live sandbox execution requires owner token, approved provider, audit logging, and explicit activation.'
  );
  return answerShape(
    'Ava is ready to help with AV planning, troubleshooting, source lookup direction, intake, proposal structure, and commissioning logic in a public-safe way.',
    'Public Ava should be useful immediately without touching private files, customer data, payments, hardware, or unverified device-code banks.',
    'Ask the AV question plainly. If one detail is required for safety or correctness, Ava should ask one focused follow-up and still give a starting path.'
  );
}

export function visibleBeingAssetStatus(env = process.env) {
  const ownerApproved = String(env.AVA_VISIBLE_BEING_OWNER_APPROVED || '').toLowerCase() === 'true';
  const assetUrl = env.AVA_VISIBLE_BEING_ASSET_URL || '';
  return {
    ownerUploadRequired: !assetUrl || !ownerApproved,
    ownerApproved,
    assetConfigured: !!assetUrl,
    assetUrl: ownerApproved ? assetUrl : '',
    publicUseAllowed: ownerApproved && !!assetUrl,
    mode: ownerApproved && assetUrl ? 'owner_approved_visual_asset' : 'owner_upload_pending_placeholder',
    rule: 'Do not generate, substitute, publish, or lock Ava’s final appearance until the owner uploads and approves the visual direction.'
  };
}

export function beingStatus(env = process.env) {
  const visual = visibleBeingAssetStatus(env);
  return {
    name: 'Ava',
    visualMode: visual.mode,
    state: visual.publicUseAllowed ? 'owner-approved visible being ready' : 'visible being placeholder waiting for owner upload',
    publicPath: CANONICAL_PUBLIC_PATH,
    indicators: ['idle','listening','thinking','answering','continuing','gated','owner-only'],
    voiceReady: String(env.AVA_ENABLE_VOICE || '').toLowerCase() === 'true',
    personalityMode: env.AVA_PERSONALITY_MODE || 'cinematic_system_architect',
    visualAsset: visual,
    notArchE: true
  };
}

export function memoryStatus(env = process.env) {
  const storageApproved = String(env.AVA_STORAGE_APPROVED_SYSTEM || '').toLowerCase() === 'true';
  const storageEnabled = String(env.AVA_STORAGE_ENABLED || '').toLowerCase() === 'true';
  return {
    enabled: storageEnabled && storageApproved && !!env.DATABASE_URL,
    approvedSystem: storageApproved,
    databaseConfigured: !!env.DATABASE_URL,
    banks: MEMORY_BANKS,
    publicMemoryWritesAllowed: false,
    customerDataRule: 'business-use customer information may be retained only in approved, secured, persistent, auditable storage, never casually inside public chat'
  };
}

export function storageStatus(env = process.env) {
  const provider = env.AVA_OBJECT_STORAGE_PROVIDER || 'not_configured';
  return {
    enabled: String(env.AVA_STORAGE_ENABLED || '').toLowerCase() === 'true' && String(env.AVA_STORAGE_APPROVED_SYSTEM || '').toLowerCase() === 'true',
    databaseConfigured: !!env.DATABASE_URL,
    objectStorageProvider: provider,
    objectBucketConfigured: !!env.AVA_OBJECT_BUCKET,
    r2Configured: provider === 'r2' && !!env.AVA_OBJECT_BUCKET,
    auditEnabled: String(env.AVA_STORAGE_AUDIT_ENABLED || 'true').toLowerCase() !== 'false',
    rawCustomerFilePublicAccess: false
  };
}

export function computerStatus(env = process.env) {
  return {
    enabled: String(env.AVA_COMPUTER_ENABLED || '').toLowerCase() === 'true' && !!env.E2B_API_KEY,
    ownerOnly: true,
    publicCommandAccess: false,
    providerConfigured: !!env.E2B_API_KEY,
    allowedUse: ['device research planning','proposal calculations','file parsing after approval','diagnostics support scripts'],
    blockedUse: ['public commands','hardware control','destructive commands','secret exposure','customer-data write without storage approval']
  };
}

export function buildIntake(body={}) {
  const msg = redactCustomerData(body.message || body.notes || '');
  return {
    purpose: 'proposal_ready_av_intake',
    requiredInputs: ['room use','room dimensions','display goal','seating','speaker/subwoofer goal','current equipment','pain points','budget direction','timeline','contact path through approved flow'],
    unknownAllowed: true,
    capturedSafeSummary: msg.slice(0, 1000),
    nextQuestions: [
      'What is the room mainly for: movies, sports, music, gaming, or mixed use?',
      'What room dimensions and seating distance do you know?',
      'Are you trying to fix an existing system or build a new one?'
    ],
    storageAction: 'do_not_store_customer_identifying_data_unless_approved_storage_flow_is_active'
  };
}

export function buildProposalDraft(body={}) {
  const project = redactCustomerData(body.project || body.message || 'AV project');
  return {
    title: 'Ava AV Proposal Draft Candidate',
    projectSummary: project.slice(0, 1000),
    recommendedStructure: ['Project purpose','Known room/system facts','Assumptions','Recommended scope','Good/Better/Best or premium tier options','Exclusions','Required measurements','Verification steps','Next decision'],
    safetyNotes: ['No electrical/code compliance guarantees','No field-ready driver claims without exact source verification','No customer-data storage unless approved'],
    ownerReviewRequired: true
  };
}
