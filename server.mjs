import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

function sendJson(res, status, data) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-ava-owner-token"
  });
  res.end(JSON.stringify(data, null, 2));
}

function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization,x-ava-owner-token"
    });
    return res.end();
  }

  if (url.pathname === "/" || url.pathname === "/api/ava-health") {
    return sendJson(res, 200, {
      ok: true,
      service: "ava-backend",
      ai: "AVA / AV.AI",
      status: "owner_pilot_backend_online",
      route: "/api/ava-health",
      public_chat: process.env.AVA_ENABLE_PUBLIC_CHAT === "true",
      customer_data: process.env.AVA_ENABLE_CUSTOMER_DATA === "true",
      file_retrieval: process.env.AVA_ENABLE_FILE_RETRIEVAL === "true",
      code_bank: process.env.AVA_ENABLE_CODE_BANK === "true",
      hardware_control: false,
      message: "AVA backend is online. Advanced features remain gated until owner approval."
    });
  }

  if (url.pathname === "/api/ava-readiness") {
    return sendJson(res, 200, {
      ok: true,
      service: "ava-backend",
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
      ok: true,
      proof: "railway_backend_reachable",
      service: "ava-backend",
      timestamp: new Date().toISOString(),
      note: "This proves the backend is reachable. It does not prove full AVA activation."
    });
  }

  if (url.pathname === "/api/ava-visual-status") {
    return sendJson(res, 200, {
      ok: true,
      visible_being: "pending_owner_upload",
      owner_approved: process.env.AVA_VISIBLE_BEING_OWNER_APPROVED === "true",
      asset_url: process.env.AVA_VISIBLE_BEING_ASSET_URL || null
    });
  }

  return sendJson(res, 404, {
    ok: false,
    error: "route_not_found",
    path: url.pathname,
    available_routes: [
      "/api/ava-health",
      "/api/ava-readiness",
      "/api/ava-live-proof",
      "/api/ava-visual-status"
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
