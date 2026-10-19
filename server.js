import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "256kb" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/app", (_req, res) => res.sendFile(path.join(__dirname, "public", "app.html")));
app.get("/access", (_req, res) => res.sendFile(path.join(__dirname, "public", "access.html")));
app.get("/config", (_req, res) => res.json({
  whopMemberUrl: process.env.WHOP_MEMBER_URL || "",
  whopAiUrl: process.env.WHOP_AI_URL || ""
}));

// Basic process-local rate limit for development/MVP. Production should use
// a shared store plus authenticated user-level quotas after Whop authentication.
const requestBuckets = new Map();
app.post("/api/chat", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const bucket = requestBuckets.get(ip) || { start: now, count: 0 };
  if (now - bucket.start > 60_000) { bucket.start = now; bucket.count = 0; }
  bucket.count += 1;
  requestBuckets.set(ip, bucket);
  if (bucket.count > 12) return res.status(429).json({ error: "Troppe richieste. Attendi un minuto e riprova." });
  try {
    const { messages } = req.body ?? {};
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "API key non configurata." });
    if (!Array.isArray(messages)) return res.status(400).json({ error: "Formato messaggi non valido." });
    if (messages.length > 30) return res.status(400).json({ error: "Conversazione troppo lunga per questa richiesta." });
    if (messages.some(m => !m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 12000)) {
      return res.status(400).json({ error: "Uno o più messaggi non sono validi." });
    }

    // TODO PRODUZIONE: verificare qui la sessione autenticata e i diritti Whop dell'utente,
    // quindi applicare il limite di utilizzo del suo piano. Non lasciare l'endpoint aperto al pubblico.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Sei l'assistente AI di AI Solopreneur System. Aiuta solopreneur, creator e imprenditori digitali con strategia, marketing, contenuti, produttività e automazioni AI. Rispondi nella lingua dell'utente, sii concreto e orientato all'azione. Non dichiarare di avere strumenti o accessi che non hai." },
          ...messages
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Errore dal provider AI." });
    res.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`AI Solopreneur System: http://localhost:${port}`));
