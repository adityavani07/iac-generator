import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  Cpu,
  CloudCog,
  Sparkles,
  Terminal,
  AlertTriangle,
} from "lucide-react";

const API_URL = "http://localhost:3001/api/generate-iac";

const PROVIDERS = [
  { value: "AWS", label: "Amazon Web Services" },
  { value: "GCP", label: "Google Cloud Platform" },
  { value: "Azure", label: "Microsoft Azure" },
];

const TOOLS = [
  { value: "Terraform", label: "Terraform (HCL)" },
  { value: "CloudFormation", label: "CloudFormation (YAML)" },
];

const EXAMPLE_PROMPTS = [
  "Create a secure S3 bucket with versioning and encryption",
  "Deploy a VPC with public and private subnets",
  "Set up a serverless API with Lambda and API Gateway",
  "Create a Kubernetes cluster with autoscaling node pools",
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("AWS");
  const [tool, setTool] = useState("Terraform");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("hcl");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Generate Code ──────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setCode("");
    setCopied(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), provider, tool }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server responded with ${res.status}`);
      }

      setCode(data.code);
      setLanguage(data.language || "hcl");
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [prompt, provider, tool]);

  // ── Copy to Clipboard ─────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  // ── Keyboard shortcut (Ctrl/Cmd + Enter) ──────────────────────────
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 relative overflow-hidden">
      {/* ── Background Glow Effects ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon-cyan/3 blur-[180px]" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="relative z-10 border-b border-surface-700/50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500/30 blur-lg rounded-full" />
              <CloudCog className="relative w-8 h-8 text-accent-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Cloud Architect
              </h1>
              <p className="text-[11px] font-medium tracking-widest uppercase text-surface-400">
                IaC Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono">gemini-3.1-flash-lite</span>
          </div>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <header className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient mb-4">
            Describe it. Generate it. Deploy it.
          </h2>
          <p className="text-surface-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Turn plain English into production-ready Infrastructure-as-Code.
            Powered by Gemini AI with security best-practices baked in.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ─── Input Panel ─────────────────────────────────────────── */}
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4.5 h-4.5 text-accent-400" />
              <h3 className="font-semibold text-white text-sm tracking-wide uppercase">
                Configuration
              </h3>
            </div>

            {/* Prompt */}
            <div>
              <label
                htmlFor="prompt-input"
                className="block text-xs font-medium text-surface-300 mb-2"
              >
                Describe your infrastructure
              </label>
              <textarea
                id="prompt-input"
                rows={5}
                placeholder="e.g. Create a secure S3 bucket with versioning, encryption at rest, and a lifecycle policy that moves objects to Glacier after 90 days…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full resize-none rounded-xl bg-surface-900 border border-surface-600/50 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all duration-200 focus:border-accent-500/60 focus:ring-2 focus:ring-accent-500/20"
              />
              <p className="mt-1.5 text-[11px] text-surface-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-300 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-300 font-mono text-[10px]">Enter</kbd> to generate
              </p>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="provider-select"
                  className="block text-xs font-medium text-surface-300 mb-2"
                >
                  Cloud Provider
                </label>
                <select
                  id="provider-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-xl bg-surface-900 border border-surface-600/50 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-accent-500/60 focus:ring-2 focus:ring-accent-500/20 cursor-pointer appearance-none"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tool-select"
                  className="block text-xs font-medium text-surface-300 mb-2"
                >
                  IaC Tool
                </label>
                <select
                  id="tool-select"
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full rounded-xl bg-surface-900 border border-surface-600/50 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-accent-500/60 focus:ring-2 focus:ring-accent-500/20 cursor-pointer appearance-none"
                >
                  {TOOLS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="group w-full relative rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-accent-500 to-neon-cyan rounded-xl transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 via-neon-cyan to-neon-purple rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-shadow duration-500" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Code
                  </>
                )}
              </span>
            </button>

            {/* Example Prompts */}
            <div>
              <p className="text-[11px] font-medium text-surface-500 mb-2 uppercase tracking-wider">
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-surface-800/80 border border-surface-600/30 text-surface-300 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-200 cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Output Panel ────────────────────────────────────────── */}
          <section className="glass-card rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
            {/* Output Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-700/50">
              <div className="flex items-center gap-2">
                {/* Terminal dots */}
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 text-xs font-mono text-surface-400">
                  {code
                    ? `output.${language === "yaml" ? "yaml" : "tf"}`
                    : "output"}
                </span>
              </div>

              {code && (
                <button
                  id="copy-btn"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-surface-700/60 text-surface-300 hover:text-accent-400 hover:bg-surface-600/60 transition-all duration-200 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Output Body */}
            <div className="flex-1 code-output">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-surface-600 border-t-accent-400 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-accent-400 animate-pulse-glow" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-surface-300 font-medium">
                      Architecting infrastructure…
                    </p>
                    <p className="text-[11px] text-surface-500 mt-1">
                      Gemini is generating secure, best-practice code
                    </p>
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-full max-w-sm space-y-2 mt-2 px-4">
                    {[75, 90, 60, 85, 45].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded animate-shimmer"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && !loading && (
                <div className="flex items-center gap-3 m-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {code && !loading && (
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  showLineNumbers
                  wrapLines
                  customStyle={{
                    background: "transparent",
                    padding: "1.25rem",
                    fontSize: "0.82rem",
                    lineHeight: "1.7",
                  }}
                  lineNumberStyle={{
                    color: "#3a3a5c",
                    fontSize: "0.72rem",
                    paddingRight: "1rem",
                    userSelect: "none",
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              )}

              {!code && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <CloudCog className="w-16 h-16 text-surface-700 mb-4" />
                  <p className="text-sm text-surface-400 font-medium">
                    Your generated code will appear here
                  </p>
                  <p className="text-[11px] text-surface-500 mt-1 max-w-xs">
                    Describe your infrastructure on the left and hit Generate to
                    see production-ready IaC
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-surface-700/30 mt-16">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-500">
          <p>
            Built by{" "}
            <span className="text-gradient font-semibold">Pixel Bug</span>
            {" "}🐛 · Powered by{" "}
            <span className="text-accent-400 font-medium">Gemini AI</span>
          </p>
          <p className="font-mono">v1.0.0</p>
        </div>
      </footer>
    </div>
  );
}
