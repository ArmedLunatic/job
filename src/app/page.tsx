import ClockInForm from "@/components/job/ClockInForm";
import JobBoard from "@/components/job/JobBoard";
import ReFiStats from "@/components/job/ReFiStats";

// ─── External links ───────────────────────────────────────────────────────────
const RUNNR_BUY_URL =
  "https://runnr.trade/trading/ANmBEJyjQveHtm9hMSMYc2f8yxbPVWKcTksauT2XKdCj?ref=ash";
const X_COMMUNITY_URL = "https://x.com/i/communities/2027220668379468230";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blue atmospheric glow — top center */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 45% at 50% -5%, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Subtle accent glow — bottom right */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 30% at 85% 80%, rgba(99,102,241,0.07) 0%, transparent 60%)",
          }}
        />

        {/* Hero bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-950" />

        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Status badge */}
          <div className="animate-fade-in-up delay-0 inline-flex items-center gap-2 rounded border border-neutral-700 bg-neutral-900 px-3 py-1 font-mono text-[10px] tracking-widest text-neutral-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            HIRING: ACTIVE
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-80 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            <span className="inline-block animate-glitch">AI TOOK</span>
            <br />
            <span className="text-blue-400">YOUR JOB.</span>
          </h1>

          <p className="animate-fade-in-up delay-160 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            GOOD NEWS:{" "}
            <span className="text-blue-400">$JOB</span> IS HIRING.
          </p>

          <p className="animate-fade-in-up delay-240 mx-auto max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Hold <span className="font-semibold text-white">$JOB</span>, earn
            every 5 minutes from creator fee payroll. No resume. No interview. No boss.
            Job description: shill, post, meme.
          </p>

          {/* CTAs — 2-col grid on mobile, flex wrap on sm+ */}
          <div className="animate-fade-in-up delay-320 grid w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            {/* Buy on Runnr — primary trading action */}
            <a
              href={RUNNR_BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded border border-green-500/40 bg-green-500/10 px-5 py-3.5 text-sm font-bold text-green-400 transition-all duration-200 hover:border-green-400/70 hover:bg-green-500/20 hover:text-green-300 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 sm:px-7"
            >
              Buy on Runnr ↗
            </a>

            {/* Clock In */}
            <a
              href="#clock-in"
              className="flex items-center justify-center rounded bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 sm:px-7"
            >
              Clock In →
            </a>

            {/* View Job Board */}
            <a
              href="#job-board"
              className="flex items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 active:scale-95 sm:px-7"
            >
              View Job Board
            </a>

            {/* X Community */}
            <a
              href={X_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded border border-neutral-800 px-5 py-3.5 text-sm font-medium text-neutral-400 transition-all duration-200 hover:border-neutral-600 hover:text-white active:scale-95 sm:px-7"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X Community
            </a>

            {/* Employee Wall — full width on mobile, auto on sm+ */}
            <a
              href="/employees"
              className="col-span-2 flex items-center justify-center rounded border border-neutral-800 px-5 py-3.5 text-sm font-medium text-neutral-400 transition-all duration-200 hover:text-white hover:border-neutral-600 active:scale-95 sm:col-auto sm:px-7"
            >
              Employee Wall
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up delay-400 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-600">
          <svg
            className="h-5 w-5 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="font-mono text-[10px] tracking-widest uppercase">SCROLL FOR POSITIONS</span>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-700 bg-neutral-900/20 py-6">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-4 font-mono text-[10px] tracking-widest uppercase text-neutral-700">
            SYSTEM INFO
          </p>
          <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
            {[
              { label: "EMPLOYEES HIRED", value: "∞" },
              { label: "RESUMES REQUIRED", value: "0" },
              { label: "BOSSES", value: "0" },
              { label: "PAYROLL SOURCE", value: "Fees" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={[
                  "relative flex flex-col items-center justify-center py-4 text-center border-neutral-800",
                  // Mobile 2-col: right column gets a left border
                  i % 2 !== 0 ? "border-l" : "",
                  // Mobile 2-col: second row gets a top border (cleared on sm+)
                  i >= 2 ? "border-t sm:border-t-0" : "",
                  // sm+ 4-col: every item except first gets a left border
                  i > 0 ? "sm:border-l" : "",
                ].filter(Boolean).join(" ")}
              >
                <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-neutral-600">
                  [{s.label}]
                </p>
                <p className="text-2xl font-black text-white sm:text-3xl tabular-nums">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clock In ──────────────────────────────────────────────────────────── */}
      <ClockInForm />

      {/* ── Job Board ─────────────────────────────────────────────────────────── */}
      <JobBoard />

      {/* ── ReFi Live Payroll Stats ────────────────────────────────────────────── */}
      <ReFiStats />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-800/60 py-10 text-center text-xs text-neutral-700">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a
            href={RUNNR_BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-green-600/70 transition-colors hover:text-green-400"
          >
            ↗ Buy on Runnr
          </a>
          <span className="text-neutral-800">·</span>
          <a
            href={X_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-neutral-600 transition-colors hover:text-neutral-400"
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X Community
          </a>
          <span className="text-neutral-800">·</span>
          <a href="/employees" className="font-mono text-[11px] tracking-widest uppercase text-neutral-600 underline transition-colors hover:text-neutral-400">
            Employee Wall
          </a>
        </div>
        <p>
          $JOB is a memecoin. Not financial advice. Payroll estimates are
          estimates. Crypto is risky. This site does not connect wallets.
        </p>
      </footer>
    </main>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How do I get paid?",
    a: "95% of all $JOB creator fees are distributed to holders every 5 minutes. The remaining 5% goes to ReFi to fund the payroll infrastructure. The more $JOB you hold, the larger your share of the 95%. Payroll estimates are displayed in the strip above and are updated periodically. Payouts are not guaranteed — this is a memecoin.",
  },
  {
    q: "Do I need a resume?",
    a: "No. No resume, no interview, no background check. The only requirement is a wallet holding $JOB. Your job title is whatever role you select when you clock in.",
  },
  {
    q: "What is local-first generation?",
    a: "Your Job Alert Card and Badge PFP are generated entirely on your device using the browser's Canvas API. No images are sent to any server until you explicitly click Publish and check the consent box. You can download them and use them anywhere without ever publishing.",
  },
  {
    q: "What happens when I publish?",
    a: "Your generated images are uploaded to a public storage bucket and your username, role, and stamp are inserted into a public database. This data is visible on the Employee Wall. Publishing is completely optional.",
  },
  {
    q: "Is there a boss?",
    a: "No. There is no central authority, no HR department, and no performance reviews. There is only the chart, the memes, and the payroll.",
  },
  {
    q: "Is $JOB safe to buy?",
    a: "This site does not connect wallets and does not provide financial advice. Crypto assets are highly volatile. Do your own research. The payroll system is novel and unproven. Only invest what you can afford to lose entirely.",
  },
];

function FaqSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10">
          <p className="mb-1 font-mono text-[10px] tracking-widest uppercase text-neutral-600">
            DOC REF: HR-FAQ-001
          </p>
          <h2 className="font-mono text-lg font-bold tracking-tight text-white sm:text-xl uppercase">
            HR POLICY — FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const prefix = `Q.${String(index + 1).padStart(2, "0")} —`;
  return (
    <details className="group rounded-sm border border-neutral-800 border-l-2 border-l-neutral-700 open:border-l-blue-500 bg-neutral-900/40 px-5 transition-all open:border-neutral-700 open:bg-neutral-900/70">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-white select-none">
        <span>
          <span className="mr-2 font-mono text-[10px] text-neutral-500">{prefix}</span>
          {q}
        </span>
        <span className="ml-4 shrink-0 font-mono text-sm text-neutral-500 group-open:text-blue-400">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">×</span>
        </span>
      </summary>
      <div className="faq-content">
        <div>
          <div className="border-t border-neutral-800/60 pt-3 pb-5">
            <p className="text-sm leading-relaxed text-neutral-400">{a}</p>
          </div>
        </div>
      </div>
    </details>
  );
}
