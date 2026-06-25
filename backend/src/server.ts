import app from "./app";
import config from "./config";

const PORT = config.port;

// ── Startup validation ───────────────────────────────────────────────
console.log("──────────────────────────────────────────────");
console.log("  Maa42 Backend — starting up");
console.log(`  Port          : ${PORT}`);
console.log(`  OpenRouter key: ${config.openrouter_api_key ? config.openrouter_api_key.slice(0, 12) + "..." : "⚠️  MISSING"}`);
console.log(`  LLM model     : ${config.openrouter_model}`);
console.log(`  Session timeout: ${config.chat_session_timeout_minutes} min`);
console.log("──────────────────────────────────────────────");

if (!config.openrouter_api_key) {
  console.error("\n❌ OPENROUTER_API_KEY is not set. Sophia chat will fail!\n   Add it to backend/.env and restart.\n");
}

// ── Graceful error handling ──────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled rejection:", reason);
});

// ── Start server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Maa42 backend running on http://localhost:${PORT}\n`);
});