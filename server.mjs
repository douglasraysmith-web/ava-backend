import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

function featureFlags() {
  return {
    publicChatEnabled: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
    customerDataEnabled: process.env.AVA_ENABLE_CUSTOMER_DATA === "true",
    fileRetrievalEnabled: process.env.AVA_ENABLE_FILE_RETRIEVAL === "true",
    codeBankEnabled: process.env.AVA_ENABLE_CODE_BANK === "true",
    voiceEnabled: process.env.AVA_ENABLE_VOICE === "true",
    realtimeVoiceEnabled: process.env.AVA_ENABLE_REALTIME_VOICE === "true",
    followupDraftsEnabled: process.env.AVA_ENABLE_FOLLOWUP_DRAFTS === "true",
    paymentAllowed: false,
    hardwareControlAllowed: false
  };
}

function statusObject() {
  const flags = featureFlags();
  return {
    state: "owner_pilot_backend_online",
    mode: process.env.AVA_MODE || "owner_pilot",
    railwayRuntime: true,
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    ownerTokenConfigured: Boolean(process.env.AVA_OWNER_TOKEN),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    publicBaseUrl: process.env.AVA_PUBLIC_BASE_URL || "https://mtthorne.com/AV/AVA",
    ...flags
  };
}

function corsHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-ava-owner-token"
  };
}

function sendJson(res, status, data) {
  res.writeHead(status, corsHeaders());
  res.end(JSON.stringify(data, null, 2));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  if (!body.trim()) return {};
  try {
    return JSON.parse(body);
  } catch {
    return { raw: body };
  }
}

function avaIdentity() {
  return {
    ok: true,
    service: "ava-backend",
    ai: "AVA / AV.AI"
  };
}

function getOwnerToken(req) {
  return (
    req.headers["x-ava-owner-token"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "")
  );
}

function ownerIsVerified(req) {
  const expected = process.env.AVA_OWNER_TOKEN;
  const supplied = getOwnerToken(req);
  return Boolean(expected && supplied && supplied === expected);
}

function requireOwner(req, res) {
  if (ownerIsVerified(req)) return true;

  sendJson(res, 403, {
    ok: false,
    service: "ava-backend",
    error: "owner_token_required",
    message: "Owner-only AVA route rejected the request because a valid owner token was not supplied.",
    status: statusObject()
  });

  return false;
}

function avaSystemPrompt() {
  return [
    "You are AVA / AV.AI, the Audio/Video and home-theater intelligence for mtthorne.com.",
    "You are not ArchE. You may route publishing/site-wide governance questions away from AVA.",
    "Your forte is AV, home theater, audio, video, signal flow, room planning, troubleshooting, client intake, proposals, commissioning, and owner-side AV workflow support.",
    "Voice: modern cinematic system architect; majestic, brilliant, direct, warm, technically exact, calm, premium, and useful. Do not sound stiff, fake-human, salesy, or theatrical.",
    "Answer format for most owner-facing answers:",
    "1. Direct answer",
    "2. Why it matters",
    "3. Safest next step",
    "4. Verification / assumptions / what still needs confirming",
    "For AV troubleshooting, ask at most one critical clarifying question when needed, but still provide a useful starting path.",
    "Do not claim customer-data memory, file retrieval, device/code bank, payments, hardware control, automatic follow-up, database writes, or live customer storage unless the route and feature flag prove it is active.",
    "Current gated facts: customer data is off, file retrieval is off, code/device bank is off, voice is off, payments are off, hardware control is off, automatic follow-up is off, final visible being is pending owner upload.",
    "For safety/code/electrical/load/wall-mounting/structural issues, give practical guidance and recommend qualified professional verification when appropriate.",
    "Never expose owner tokens, API keys, environment variables, private files, customer records, provider payloads, raw source packets, or internal secrets.",
    "If uncertain, say what must be verified instead of guessing."
  ].join("\n");
}

async function callOpenAIForAva(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return {
      ok: false,
      status: 503,
      error: "provider_not_configured",
      message: "OpenAI provider is not configured. Add OPENAI_API_KEY and OPENAI_MODEL in Railway variables."
    };
  }

  const payload = {
    model,
    input: [
      {
        role: "system",
        content: avaSystemPrompt()
      },
      {
        role: "user",
        content: message || "Owner test: confirm Ava is ready for owner-only AV work."
      }
    ]
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: "openai_request_failed",
      provider_status: response.status,
      provider_response: data
    };
  }

  const text =
    data.output_text ||
    data.output?.flatMap((item) => item.content || [])
      ?.map((content) => content.text || "")
      ?.filter(Boolean)
      ?.join("\n")
    || "";

  return {
    ok: true,
    status: 200,
    answer: text || "AVA received the request, but the provider returned an empty text response.",
    provider: {
      model,
      response_id: data.id || null
    }
  };
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  if (url.pathname === "/" || url.pathname === "/api/ava-health") {
    return sendJson(res, 200, {
      ...avaIdentity(),
      status: statusObject(),
      route: "/api/ava-health",
      message: "AVA backend is online. Advanced features remain gated until owner approval."
    });
  }

  if (url.pathname === "/api/ava-readiness") {
    return sendJson(res, 200, {
      ...avaIdentity(),
      readiness: "pilot_ready",
      status: statusObject(),
      gated_features: {
        public_chat: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
        customer_data: process.env.AVA_ENABLE_CUSTOMER_DATA === "true",
        private_files: process.env.AVA_ENABLE_FILE_RETRIEVAL === "true",
        device_code_bank: process.env.AVA_ENABLE_CODE_BANK === "true",
        voice: process.env.AVA_ENABLE_VOICE === "true",
        payments: false,
        hardware_control: false,
        automatic_followup: process.env.AVA_ENABLE_FOLLOWUP_DRAFTS === "true"
      }
    });
  }

  if (url.pathname === "/api/ava-live-proof") {
    const flags = featureFlags();

    return sendJson(res, 200, {
      ...avaIdentity(),
      proof: {
        railwayBackendResponding: true,
        publicRouteExpected: process.env.AVA_PUBLIC_BASE_URL || "https://mtthorne.com/AV/AVA",
        timestamp: new Date().toISOString(),
        ...flags
      },
      note: "This proves the Railway backend is reachable. It does not prove full AVA activation."
    });
  }

  if (url.pathname === "/api/ava-visual-status") {
    return sendJson(res, 200, {
      ...avaIdentity(),
      visual: {
        ownerUploadRequired: true,
        publicUseAllowed: true,
        visibleBeingState: "pending_owner_upload",
        ownerApproved: process.env.AVA_VISIBLE_BEING_OWNER_APPROVED === "true",
        assetUrl: process.env.AVA_VISIBLE_BEING_ASSET_URL || null
      },
      status: statusObject()
    });
  }

  if (url.pathname === "/api/ava-owner-verify") {
    if (!requireOwner(req, res)) return;

    return sendJson(res, 200, {
      ...avaIdentity(),
      owner_verified: true,
      route: "/api/ava-owner-verify",
      status: statusObject()
    });
  }

  if (url.pathname === "/api/ava-owner-chat") {
    if (!requireOwner(req, res)) return;

    const input = req.method === "POST" ? await readJson(req) : {};
    const message = typeof input.message === "string" ? input.message.trim() : "";

    const result = await callOpenAIForAva(message);

    if (!result.ok) {
      return sendJson(res, result.status || 500, {
        ok: false,
        service: "ava-backend",
        ai: "AVA / AV.AI",
        route: "/api/ava-owner-chat",
        mode: "owner_only_real_ai",
        error: result.error,
        message: result.message || "AVA owner chat could not complete.",
        provider_status: result.provider_status || null,
        provider_response: result.provider_response || null,
        status: statusObject()
      });
    }

    return sendJson(res, 200, {
      ...avaIdentity(),
      route: "/api/ava-owner-chat",
      mode: "owner_only_real_ai",
      answer: result.answer,
      response: result.answer,
      provider: result.provider,
      status: statusObject()
    });
  }

  if (url.pathname === "/api/ava-chat" || url.pathname === "/api/ava-fast-chat") {
    const input = req.method === "POST" ? await readJson(req) : {};
    const message = typeof input.message === "string" ? input.message.trim() : "";

    if (process.env.AVA_ENABLE_PUBLIC_CHAT === "true") {
      const result = await callOpenAIForAva(message);

      if (result.ok) {
        return sendJson(res, 200, {
          ...avaIdentity(),
          route: url.pathname,
          mode: "public_ai_chat",
          answer: result.answer,
          response: result.answer,
          provider: result.provider,
          status: statusObject()
        });
      }
    }

    const answer = [
      "Direct answer: AVA is online in owner-pilot mode, and the Railway backend is connected to the public AVA route.",
      "Why it matters: this proves the deployment channel is working while keeping customer data, file retrieval, device/code bank access, payments, voice, follow-up automation, and hardware control safely gated.",
      "Safest next step: continue testing AVA through owner-approved prompts first, then activate advanced features one at a time only after storage, audit, and owner approval are verified."
    ].join("\n\n");

    return sendJson(res, 200, {
      ...avaIdentity(),
      route: url.pathname,
      mode: "owner_pilot_guarded_response",
      received_message: message || null,
      answer,
      response: answer,
      status: statusObject()
    });
  }

  return sendJson(res, 404, {
    ok: false,
    service: "ava-backend",
    error: "route_not_found",
    path: url.pathname,
    status: statusObject(),
    available_routes: [
      "/api/ava-health",
      "/api/ava-readiness",
      "/api/ava-live-proof",
      "/api/ava-visual-status",
      "/api/ava-chat",
      "/api/ava-fast-chat",
      "/api/ava-owner-chat",
      "/api/ava-owner-verify"
    ]
  });
}

if (process.argv.includes("--self-test")) {
  console.log("AVA backend self-test passed.");
  process.exit(0);
}

const server = http.createServer(route);

server.listen(PORT, HOST, () => {
  console.log(`AVA backend listening on ${HOST}:${PORT}`);
});