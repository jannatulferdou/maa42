import dotenv from 'dotenv';
import path from 'path';

// Resolve .env relative to the project root (one level up from src/config/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Warn loudly if critical env vars are missing
if (!process.env.OPENROUTER_API_KEY) {
  console.warn('\n⚠️  WARNING: OPENROUTER_API_KEY is not set in backend/.env — Sophia chat will not work!\n');
}

const config = {
    connection_str: process.env.DATABASE_URL || '',
    port: process.env.PORT || 5000,

    openrouter_api_key: process.env.OPENROUTER_API_KEY || '',
    openrouter_model: process.env.OPENROUTER_MODEL || 'x-ai/grok-4.3',
    chat_session_timeout_minutes: Number(process.env.CHAT_SESSION_TIMEOUT_MINUTES || 30),
}

export default config;