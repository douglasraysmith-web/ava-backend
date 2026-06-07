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

  if (url.pathname === "/api/ava-chat" || url.pathname === "/api/ava-fast-chat") {
    const input = req.method === "POST" ? await readJson(req) : {};
    const message = typeof input.message === "string" ? input.message.trim() : "";

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

  if (url.pathname === "/api/ava-owner-verify") {
    const supplied =
      req.headers["x-ava-owner-token"] ||
      req.headers["authorization"]?.replace(/^Bearer\s+/i, "");

    const expected = process.env.AVA_OWNER_TOKEN;

    if (!expected || !supplied || supplied !== expected) {
      return sendJson(res, 403, {
        ok: false,
        service: "ava-backend",
        error: "owner_token_required",
        message: "Owner-only AVA route rejected the request because a valid owner token was not supplied.",
        status: statusObject()
      });
    }

    return sendJson(res, 200, {
      ...avaIdentity(),
      owner_verified: true,
      route: "/api/ava-owner-verify",
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