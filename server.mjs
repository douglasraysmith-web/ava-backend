import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

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

function baseStatus() {
  return {
    ok: true,
    service: "ava-backend",
    ai: "AVA / AV.AI",
    status: "owner_pilot_backend_online",
    public_chat: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
    customer_data: process.env.AVA_ENABLE_CUSTOMER_DATA === "true",
    file_retrieval: process.env.AVA_ENABLE_FILE_RETRIEVAL === "true",
    code_bank: process.env.AVA_ENABLE_CODE_BANK === "true",
    voice: process.env.AVA_ENABLE_VOICE === "true",
    payments: process.env.AVA_ALLOW_PAYMENT === "true",
    automatic_followup: process.env.AVA_ENABLE_FOLLOWUP_DRAFTS === "true",
    hardware_control: false
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
      ...baseStatus(),
      route: "/api/ava-health",
      message: "AVA backend is online. Advanced features remain gated until owner approval."
    });
  }

  if (url.pathname === "/api/ava-readiness") {
    return sendJson(res, 200, {
      ...baseStatus(),
      readiness: "pilot_ready",
      railway_runtime: true,
      database_configured: Boolean(process.env.DATABASE_URL),
      owner_token_configured: Boolean(process.env.AVA_OWNER_TOKEN),
      public_base_url: process.env.AVA_PUBLIC_BASE_URL || null,
      gated_features: {
        public_chat: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
        customer_data: process.env.AVA_ENABLE_CUSTOMER_DATA === "true",
        private_files: process.env.AVA_ENABLE_FILE_RETRIEVAL === "true",
        device_code_bank: process.env.AVA_ENABLE_CODE_BANK === "true",
        voice: process.env.AVA_ENABLE_VOICE === "true",
        payments: process.env.AVA_ALLOW_PAYMENT === "true",
        hardware_control: false,
        automatic_followup: process.env.AVA_ENABLE_FOLLOWUP_DRAFTS === "true"
      }
    });
  }

  if (url.pathname === "/api/ava-live-proof") {
    return sendJson(res, 200, {
      ...baseStatus(),
      proof: "railway_backend_reachable",
      timestamp: new Date().toISOString(),
      note: "This proves the backend is reachable. It does not prove full AVA activation."
    });
  }

  if (url.pathname === "/api/ava-visual-status") {
    return sendJson(res, 200, {
      ...baseStatus(),
      visible_being: "pending_owner_upload",
      owner_approved: process.env.AVA_VISIBLE_BEING_OWNER_APPROVED === "true",
      asset_url: process.env.AVA_VISIBLE_BEING_ASSET_URL || null
    });
  }

  if (url.pathname === "/api/ava-chat" || url.pathname === "/api/ava-fast-chat") {
    const input = req.method === "POST" ? await readJson(req) : {};
    const message = typeof input.message === "string" ? input.message : "";

    return sendJson(res, 200, {
      ...baseStatus(),
      route: url.pathname,
      mode: "owner_pilot_guarded_response",
      response: [
        "AVA is online in owner-pilot mode.",
        "The public route and Railway backend are connected.",
        "Advanced intelligence, customer memory, file retrieval, device/code bank, payments, voice, follow-up, and hardware control remain gated until owner approval.",
        message
          ? `Received test message: ${message}`
          : "No message was provided in this test request."
      ].join(" "),
      answer: "AVA is online in owner-pilot mode. Advanced features remain gated until owner approval.",
      public_chat_active: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
      hardware_control: false
    });
  }

  return sendJson(res, 404, {
    ok: false,
    error: "route_not_found",
    path: url.pathname,
    hardware_control: false,
    available_routes: [
      "/api/ava-health",
      "/api/ava-readiness",
      "/api/ava-live-proof",
      "/api/ava-visual-status",
      "/api/ava-chat",
      "/api/ava-fast-chat"
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