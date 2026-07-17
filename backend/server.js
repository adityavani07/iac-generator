import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

// ── Config ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const MODEL = "gemini-3.1-flash-lite";

const ai = new GoogleGenAI({}); // auto-detects GEMINI_API_KEY from env

const SYSTEM_INSTRUCTION = `You are an expert cloud architect and Infrastructure-as-Code engineer.
Your ONLY job is to generate syntactically correct, production-ready infrastructure code.

STRICT RULES:
1. Output ONLY raw code inside a single markdown fenced code block.
2. Do NOT include any explanation, commentary, or notes outside the code block.
3. Use best-practice defaults for security (least-privilege IAM, encryption at rest, private networking).
4. Add concise inline comments inside the code to explain each resource.
5. The very first line of your response MUST be the opening fence of the code block.`;

// ── Express App ──────────────────────────────────────────────────────
const app = express();

// CORS: allow Vercel frontend in production, all origins in dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0
      ? (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) cb(null, true);
          else cb(new Error("Not allowed by CORS"));
        }
      : true, // allow all in dev
  })
);
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: MODEL });
});

// ── Generate IaC Endpoint ────────────────────────────────────────────
app.post("/api/generate-iac", async (req, res) => {
  const { prompt, provider, tool } = req.body;

  // Input validation
  if (!prompt || !provider || !tool) {
    return res.status(400).json({
      error: "Missing required fields: prompt, provider, and tool are all required.",
    });
  }

  const validProviders = ["AWS", "GCP", "Azure"];
  const validTools = ["Terraform", "CloudFormation"];

  if (!validProviders.includes(provider)) {
    return res.status(400).json({
      error: `Invalid provider "${provider}". Must be one of: ${validProviders.join(", ")}`,
    });
  }

  if (!validTools.includes(tool)) {
    return res.status(400).json({
      error: `Invalid tool "${tool}". Must be one of: ${validTools.join(", ")}`,
    });
  }

  const userPrompt = `Cloud Provider: ${provider}
IaC Tool: ${tool}

User Request: ${prompt}

Generate the complete ${tool} code for ${provider} that fulfills this request.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const rawText = response.text ?? "";

    // Extract code from markdown fences if present
    const fenceMatch = rawText.match(/```[\w-]*\n?([\s\S]*?)```/);
    const code = fenceMatch ? fenceMatch[1].trim() : rawText.trim();

    // Determine syntax language for the frontend highlighter
    const language = tool === "CloudFormation" ? "yaml" : "hcl";

    res.json({ code, language, model: MODEL });
  } catch (err) {
    console.error("[Gemini Error]", err);
    console.error("[Gemini Error Details]", JSON.stringify({
      message: err.message,
      status: err.status,
      statusText: err.statusText,
      errorDetails: err.errorDetails,
    }, null, 2));

    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again shortly." });
    }

    const errorMsg = err.message || "Failed to generate infrastructure code. Please try again.";
    res.status(500).json({ error: errorMsg });
  }
});

// ── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  IaC Generator API running → http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   API Key: ${process.env.GEMINI_API_KEY ? "✔ loaded" : "✘ MISSING — set GEMINI_API_KEY in .env"}\n`);
});
