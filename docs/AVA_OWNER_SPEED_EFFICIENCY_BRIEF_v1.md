# Ava Owner Speed-Efficiency Brief v1.0
## Feature Systems That Remain Gated Until Owner Approval
Date: 2026-06-03
Status: Owner Review Candidate

## Purpose
This brief explains the six higher-risk Ava systems the owner asked about:

1. Private file retrieval
2. Customer file retrieval
3. Device/code bank live access
4. Payment/account workflows
5. Hardware control
6. Automatic customer follow-up

The goal is not to make Ava reckless. The goal is to make Ava fast **because she is organized, gated, source-aware, and auditable**. Ava should save the owner time by finding the right thing the first time, using the correct source bank, returning the correct file or action path, and refusing anything that is not approved, verified, or safe.

Ava's speed comes from structure, not from guessing.

---

# Owner-Level Speed Philosophy
Ava is being built to remove repeated manual searching, repeated customer intake, repeated device-code hunting, repeated proposal drafting, repeated follow-up writing, and repeated troubleshooting reconstruction.

Ava should work like this:

1. Identify the user and access level.
2. Identify the project/customer/system/device context.
3. Pull the correct record or file from the correct bank.
4. Check permission and evidence status.
5. Return the fastest safe answer or action packet.
6. Log what happened so the next request is faster.

That is the whole speed advantage.

Ava should not become fast by skipping safety, mixing customers, exposing private files, inventing device codes, making payments, controlling hardware, or messaging customers without approval.

---

# 1. Private File Retrieval

## What it does
Private file retrieval lets Ava find and return owner-side files such as:

- internal AV source files
- proposal templates
- commissioning templates
- product/package files
- device source records
- driver lookup reports
- private owner notes
- package drafts
- Ava governance/source files
- correction ledgers

## Why Ava does it our way
Private file retrieval must be **metadata-first** and **permission-gated**. Ava should not blindly expose raw files just because a user asks. She should first identify:

- who is asking
- whether the request is owner-only
- what file class is requested
- whether the file exists
- whether the file is approved, draft, archived, or superseded
- whether the file can be returned directly or only summarized

This prevents private files, dealer-only sources, internal prompts, and customer material from leaking into the wrong context.

## How it is speed efficient
The owner should not have to remember exact filenames. Ava should retrieve by meaning:

- “Give me the latest owner demo gate.”
- “Find the Control4 driver lookup report for the Sony projector project.”
- “Pull the premium proposal template.”
- “Show me the latest Ava source.”

Ava searches the File Vault by metadata, tags, project, version, lifecycle state, and access class instead of making the owner hunt through folders.

## Required data fields
Each private file record should include:

- file_id
- title
- file_type
- bank
- project_id, if applicable
- owner_only flag
- lifecycle_state: draft / active / approved / archived / superseded
- access_class: owner / staff / customer / public
- source_status
- version
- checksum, where available
- storage_path or provider pointer
- last_verified_at
- notes

## Owner-facing behavior
When asked for a private file, Ava should answer in this structure:

- File found / not found
- Best match
- Version and status
- Access classification
- Why this is the right file
- Direct file route if permitted
- Safer alternative if not permitted

## Gate status
Private file retrieval stays OFF for public users. Owner demo can show simulated retrieval or owner-approved real retrieval only.

---

# 2. Customer File Retrieval

## What it does
Customer file retrieval lets Ava find files related to a specific customer or job, such as:

- room measurements
- photos
- signed approvals
- design drafts
- proposal versions
- installation notes
- equipment lists
- invoices or quote references
- commissioning reports
- support history

## Why Ava does it our way
Customer files must be separated from private owner files and from other customers. Ava needs customer/project scoping before she retrieves anything.

Ava must never respond to “show me the Johnson file” by guessing. She must check identity, project, authorization, and file class.

## How it is speed efficient
Most AV businesses lose time because job information is scattered across texts, emails, photos, PDFs, notes, and memory. Ava should collapse that into one project memory path:

Customer → Project → Room/System → Devices → Files → Proposals → Diagnostics → Commissioning → Follow-ups

This means the owner can ask:

- “What did we promise this customer?”
- “Which projector did they approve?”
- “Show me their room photos.”
- “What was left unresolved after commissioning?”

Ava returns the job context without the owner rebuilding the whole history manually.

## Required controls
Customer file retrieval requires:

- customer/project identity confirmed
- access permission confirmed
- audit log entry
- file classification
- retention policy
- customer-data approval gate
- no cross-customer leakage

## Owner-facing behavior
Ava should return a customer file packet:

- Customer / project match
- File list grouped by use
- Recommended file first
- Current status
- Missing files
- Next action

## Gate status
Customer file retrieval remains OFF until customer-data retention is approved and the secured database/storage layer is active.

---

# 3. Device / Code Bank Live Access

## What it does
The device/code bank gives Ava structured access to:

- device inventory
- model numbers
- driver records
- IR code records
- RS-232 command records
- IP/API protocol records
- installer manuals
- source cards
- compatibility notes
- confidence levels
- field-test status

## Why Ava does it our way
Device codes and control commands are dangerous if guessed. A wrong code can fail silently; a wrong configuration command can break a system; a wrong compatibility claim can waste hours on-site.

Ava must store codes as source-backed records, not as loose text.

Every code or command must have:

- manufacturer
- exact model or series
- target platform
- command/control method
- source type
- source URL or source pointer
- command safety class
- confidence level
- version/date, where available
- access requirement
- field_ready_status
- test status

## How it is speed efficient
A technician or owner should not have to repeatedly search:

- manufacturer manuals
- forum posts
- driver stores
- old notes
- dealer portals
- IR databases
- project files

Ava should produce a ranked lookup:

1. exact certified platform driver, if verified
2. official platform driver
3. manufacturer protocol/API
4. professional marketplace driver
5. IR database
6. community clue
7. custom driver planning path

This saves time because Ava knows the search order and confidence rules before the work begins.

## Live access behavior
When live access is approved, Ava should:

- search the device bank first
- verify recency/status
- return a source card
- classify command safety
- refuse destructive commands without approval
- require field testing before field-ready claims

## Gate status
Device/code bank live access remains OFF until the owner approves the bank connection, access rules, and test procedure.

---

# 4. Payment / Account Workflows

## What it does
Payment/account workflows may eventually allow Ava to help with:

- package selection
- quote status
- deposit/payment link routing
- account status explanations
- purchase handoff
- paid package access status
- support escalation

## Why Ava does it our way
Payment and account actions carry legal, privacy, and financial risk. Ava should not independently charge, refund, change subscriptions, change account status, or promise pricing unless the owner-approved payment system and policies are active.

Ava's job should be speed through routing and clarity, not uncontrolled financial action.

## How it is speed efficient
Ava can reduce owner/admin load by:

- explaining package choices
- identifying what the customer is trying to buy
- collecting required non-sensitive project inputs
- routing to the correct checkout or owner review path
- generating a clean quote/request packet
- showing payment/account status only when authorized

This keeps the owner from answering the same basic package and status questions repeatedly.

## Required controls
Payment/account workflows require:

- owner-approved provider
- payment processor configuration
- account identity check
- audit log
- refund/change limits
- human approval for sensitive actions
- no raw card handling by Ava
- no promise of pricing unless sourced

## Gate status
Payment/account workflows remain OFF until payment provider, pricing rules, account policy, and owner approval are in place.

---

# 5. Hardware Control

## What it does
Hardware control would allow Ava, in a future approved environment, to interact with AV equipment or control platforms through a local gateway, API, control processor, or approved integration.

Potential future actions include:

- read device status
- confirm network reachability
- test power/input status
- run safe diagnostics
- trigger approved scenes
- prepare command queues
- assist commissioning

## Why Ava does it our way
Hardware control is the highest-risk category because commands can change real equipment. Ava must never jump directly from chat to live hardware action.

The safe progression is:

1. Explain / plan only
2. Read-only status checks
3. Human-approved normal control
4. Human-approved configuration action
5. Destructive or persistent changes blocked unless extraordinary approval and official documentation exist

## How it is speed efficient
Hardware control becomes fast only after it becomes safe and repeatable. Ava should save time by:

- identifying the correct device
- identifying the correct command source
- checking current state first
- using known macros/scenes
- preventing repeated manual test steps
- generating commissioning test results
- logging outcomes for future diagnostics

## Required controls
Hardware control requires:

- local gateway or approved control-system integration
- device identity confirmation
- command allowlist
- command safety classes
- owner approval for live execution
- visible action preview
- emergency stop / rollback path where possible
- audit log
- read-only mode before control mode

## Gate status
Hardware control remains OFF. Ava may plan hardware actions and produce command checklists, but she must not execute hardware commands until the owner approves the live-control architecture and safety gates.

---

# 6. Automatic Customer Follow-Up

## What it does
Automatic customer follow-up may eventually allow Ava to draft, queue, or send customer messages based on project status.

Examples:

- appointment reminders
- missing-information requests
- proposal follow-up
- quote approval reminders
- post-install check-ins
- unresolved issue follow-up
- maintenance reminders
- review/testimonial requests

## Why Ava does it our way
Automatic messages can help the business, but they can also annoy customers, expose information, or say the wrong thing if uncontrolled. Ava should start in **draft/queue mode**, not automatic send mode.

## How it is speed efficient
Ava saves time by:

- knowing which customer/project needs action
- drafting the right message from project status
- using the correct tone
- including the right missing items
- avoiding repeated manual typing
- reminding the owner before opportunities go cold

The owner should review/approve messages until Ava’s follow-up templates, timing rules, and customer-data system are proven.

## Required controls
Automatic customer follow-up requires:

- customer communication consent or business basis
- contact record
- project status trigger
- approved template
- message preview
- owner approval for sensitive messages
- unsubscribe/stop handling where applicable
- communication log
- no follow-up about payments, private files, or technical promises unless sourced and approved

## Gate status
Automatic customer follow-up remains OFF as auto-send. Draft/queue mode may be used in owner demo or owner pilot.

---

# Owner Activation Order

Ava should not activate all six systems at once. The recommended activation order is:

1. Private file retrieval — owner-only, metadata-first
2. Device/code bank lookup — read-only/source-card mode
3. Customer file retrieval — limited project pilot after customer-data gate
4. Automatic customer follow-up — draft/queue only
5. Payment/account workflow — route/status only before real actions
6. Hardware control — last, read-only first, live action only after safety architecture

This order gives the owner speed early while keeping the riskiest actions locked until Ava has proven herself.

---

# Owner Demo Explanation

During the owner demo, Ava should say something like:

“I am built to make the AV business faster by remembering the right project context, finding the right file, locating the right device source, drafting the right customer communication, and blocking actions that should not happen without approval. I do not become fast by guessing. I become fast because my banks are organized, my permissions are checked, and my records make the next request easier than the last one.”

---

# Final Owner Decision Gate

The owner should approve each system separately:

- Approve private file retrieval?
- Approve customer file retention/retrieval?
- Approve device/code bank live lookup?
- Approve payment/account routing?
- Approve hardware read-only diagnostics?
- Approve hardware control?
- Approve customer follow-up drafting?
- Approve customer follow-up sending?

No approval means Ava stays in owner-demo or draft-only mode.
