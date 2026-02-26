import ClockInForm from "@/components/job/ClockInForm";
import JobBoard from "@/components/job/JobBoard";

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

        {/* Primary blue glow — center */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[700px] w-[700px] rounded-full bg-blue-600/15 blur-[140px]" />
        </div>

        {/* Secondary amber glow — bottom-right offset */}
        <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
          <div className="h-[400px] w-[400px] rounded-full bg-amber-500/6 blur-[120px]" />
        </div>

        {/* Hero bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-950" />

        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Badge */}
          <div
            className="animate-fade-in-up delay-0 inline-flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-900/80 px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            Now hiring — all positions open
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-80 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            <span className="animate-glitch inline-block">AI TOOK</span>
            <br />
            <span className="text-blue-400">YOUR JOB.</span>
          </h1>

          <p className="animate-fade-in-up delay-160 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            GOOD NEWS:{" "}
            <span className="text-blue-400">$JOB</span> IS HIRING.
          </p>

          <p className="animate-fade-in-up delay-240 mx-auto max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Hold <span className="font-semibold text-white">$JOB</span>, earn
            hourly from creator fee payroll. No resume. No interview. No boss.
            Job description: shill, post, meme.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-320 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#clock-in"
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
            >
              Clock In →
            </a>
            <a
              href="#job-board"
              className="rounded-xl border border-neutral-700 bg-neutral-900/80 px-7 py-3.5 text-sm font-bold text-white transition-all hover:border-neutral-500 hover:bg-neutral-800 active:scale-95"
            >
              View Job Board
            </a>
            <a
              href="/employees"
              className="rounded-xl border border-neutral-800/80 px-7 py-3.5 text-sm font-medium text-neutral-400 transition-all hover:text-white hover:border-neutral-600 active:scale-95"
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
          <span className="text-[10px] tracking-widest uppercase font-medium">scroll</span>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-800/60 bg-neutral-900/20 py-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
            {[
              { label: "Employees hired", value: "∞" },
              { label: "Resumes required", value: "0" },
              { label: "Bosses", value: "0" },
              { label: "Payroll source", value: "Fees" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`
                  relative flex flex-col items-center justify-center py-4 text-center
                  ${i > 0 ? "border-l border-neutral-800/60" : ""}
                `}
              >
                <div className="mb-2 h-0.5 w-8 rounded-full bg-blue-500/40" />
                <p className="text-2xl font-black text-white sm:text-3xl tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-neutral-500 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clock In ──────────────────────────────────────────────────────────── */}
      <ClockInForm />

      {/* ── Job Board ─────────────────────────────────────────────────────────── */}
      <JobBoard />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-800/60 py-10 text-center text-xs text-neutral-700">
        <p>
          $JOB is a memecoin. Not financial advice. Payroll estimates are
          estimates. Crypto is risky. This site does not connect wallets.
        </p>
        <p className="mt-2">
          <a href="/employees" className="underline hover:text-neutral-500">
            Employee Wall
          </a>
        </p>
      </footer>
    </main>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How do I get paid?",
    a: "$JOB distributes a portion of creator fees to holders as hourly payroll. The more $JOB you hold, the larger your share. Payroll estimates are displayed in the strip above and are updated periodically. Payouts are not guaranteed — this is a memecoin.",
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
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Questions
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 transition-all open:border-neutral-700 open:bg-neutral-900/70">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-white select-none">
        {q}
        <span className="ml-4 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180 group-open:text-blue-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-neutral-800/60 pt-3 pb-5">
        <p className="text-sm leading-relaxed text-neutral-400">{a}</p>
      </div>
    </details>
  );
}
