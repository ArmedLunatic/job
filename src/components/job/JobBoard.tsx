"use client";

import { useState } from "react";
import type { Role } from "@/lib/job/types";

type JobCard = {
  id: number;
  title: string;
  role: Role;
  emoji: string;
  multiplier: string;
  multiplierColor: string;
  borderColor: string;
  description: string;
  tasks: string[];
  shillScript: string;
};

const JOBS: JobCard[] = [
  {
    id: 1,
    title: "Chief Shill Officer",
    role: "marketing",
    emoji: "📣",
    multiplier: "2x",
    multiplierColor: "bg-blue-600",
    borderColor: "border-l-blue-600",
    description: "Spread the $JOB gospel across all platforms.",
    tasks: [
      "Post 10+ times daily across X / CT",
      "Tag macro influencers in every drop",
      "Translate $JOB narrative to your community",
    ],
    shillScript:
      "BREAKING: AI just automated 50% of white-collar jobs. Good news: $JOB is HIRING. Hold $JOB, earn hourly from creator fee payroll. No resume. No interview. Just vibe. 👔 $JOB",
  },
  {
    id: 2,
    title: "Meme Guy",
    role: "designer",
    emoji: "🐸",
    multiplier: "1.5x",
    multiplierColor: "bg-purple-600",
    borderColor: "border-l-purple-600",
    description: "If it's funny and has $JOB in it, that's your responsibility.",
    tasks: [
      "Ship memes daily, no excuses",
      "Remix trending formats with $JOB lore",
      "Drop reaction content the second the chart moves",
    ],
    shillScript:
      "my job title is 'Meme Guy.' my office is X dot com. my salary is $JOB payroll. i have never been more employable. 🐸 $JOB",
  },
  {
    id: 3,
    title: "Shitposter",
    role: "other",
    emoji: "💩",
    multiplier: "3x",
    multiplierColor: "bg-yellow-500",
    borderColor: "border-l-yellow-500",
    description: "Flood the timeline. Quantity IS quality.",
    tasks: [
      "Post $JOB content non-stop, all hours",
      "Reply-guy every crypto thread on CT",
      "Never let the timeline breathe",
    ],
    shillScript:
      "did u know u can get paid just for posting about $JOB. like actually paid. hourly. i just post all day. this is my job now. i love my job. $JOB",
  },
  {
    id: 4,
    title: "Head of HR",
    role: "operations",
    emoji: "📋",
    multiplier: "1x",
    multiplierColor: "bg-neutral-600",
    borderColor: "border-l-neutral-600",
    description: "Recruit new employees to the $JOB family.",
    tasks: [
      "DM 5 degens per day about $JOB",
      "Share new hire posts to recruit",
      "Help onboard new $JOB holders",
    ],
    shillScript:
      "We are hiring at $JOB. Requirements: wallet. Salary: hourly payroll. Benefits: vibes + gains. No experience necessary. Apply by buying $JOB.",
  },
  {
    id: 5,
    title: "Community Guy",
    role: "product",
    emoji: "🤝",
    multiplier: "1.5x",
    multiplierColor: "bg-teal-600",
    borderColor: "border-l-teal-600",
    description: "Keep the $JOB family together. You know everyone. Everyone knows you.",
    tasks: [
      "Welcome every new holder publicly",
      "Organize community spaces and calls",
      "Be the vibe when the chart isn't",
    ],
    shillScript:
      "there's a token called $JOB where literally everyone is an employee. the community goes hard. holding pays hourly. if u don't have a job yet what r u doing $JOB",
  },
  {
    id: 6,
    title: "C-Suite Executive",
    role: "leadership",
    emoji: "👑",
    multiplier: "2x",
    multiplierColor: "bg-amber-600",
    borderColor: "border-l-amber-600",
    description: "Executive-level posting with gravitas.",
    tasks: [
      "Write long-form $JOB thought leadership",
      "Engage with KOLs as a peer",
      "Champion $JOB in spaces and AMAs",
    ],
    shillScript:
      "In 20 years in finance I've never seen anything like $JOB. They pay you to hold. No KYC. No resume. Just wallet. This changes everything.",
  },
  {
    id: 7,
    title: "Full-Stack Dev",
    role: "engineer",
    emoji: "💻",
    multiplier: "1.5x",
    multiplierColor: "bg-blue-500",
    borderColor: "border-l-blue-500",
    description: "Build tools, bots, and integrations for $JOB.",
    tasks: [
      "Build $JOB tracking tools",
      "Create bots that post $JOB stats",
      "Help improve the $JOB site (PRs welcome)",
    ],
    shillScript:
      "just deployed a bot that monitors $JOB payroll and tweets every hour. unemployed by ChatGPT, rehired by $JOB. the irony is not lost on me.",
  },
  {
    id: 8,
    title: "Diamond Hands",
    role: "other",
    emoji: "💎",
    multiplier: "UNFIREABLE",
    multiplierColor: "bg-red-600",
    borderColor: "border-l-red-600",
    description: "-90%? Buying more. You are the floor.",
    tasks: [
      "Never sell, no matter what",
      "Buy every dip without hesitation",
      "Post 'still holding' during every red day",
    ],
    shillScript:
      "chart red. i buy. chart green. i hold. chart red again. i buy again. this is what $JOB hired me to do and i take my job very seriously. 💎 $JOB",
  },
];

export default function JobBoard() {
  const [copied, setCopied] = useState<number | null>(null);

  function copyScript(id: number, text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {});
  }

  return (
    <section id="job-board" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-blue-400">
              Open Positions
            </p>
            <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
              OPEN POSITIONS — ALL DEPARTMENTS
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              Pick your role. Copy the shill script. Clock in. Get paid.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            UPDATED: LIVE
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {JOBS.map((job) => (
            <JobCardItem
              key={job.id}
              job={job}
              copied={copied === job.id}
              onCopy={() => copyScript(job.id, job.shillScript)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function JobCardItem({
  job,
  copied,
  onCopy,
}: {
  job: JobCard;
  copied: boolean;
  onCopy: () => void;
}) {
  const [showScript, setShowScript] = useState(false);
  const refNum = `JB-${String(job.id).padStart(3, "0")}`;

  return (
    <div
      className={`group flex flex-col rounded border border-neutral-800 border-l-4 ${job.borderColor} bg-neutral-900/50 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-900`}
    >
      {/* Card header bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          REF: {refNum}
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${job.multiplierColor}`}
        >
          {job.multiplier}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title + emoji */}
        <div className="mb-3">
          <div className="mb-1 text-xl">{job.emoji}</div>
          <h3 className="text-sm font-semibold leading-snug text-white">
            {job.title}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            DEPT: {job.role}
          </p>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs leading-relaxed text-neutral-400">
          {job.description}
        </p>

        {/* Tasks */}
        <div className="mb-5 flex-1">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-600">
            RESPONSIBILITIES:
          </p>
          <ul className="space-y-1.5">
            {job.tasks.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                <span className="mt-0.5 shrink-0 text-blue-400/70">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Shill script toggle */}
          <button
            type="button"
            onClick={() => setShowScript((v) => !v)}
            className="w-full rounded border border-neutral-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
          >
            {showScript ? "▴ HIDE" : "▾ VIEW TALKING POINTS"}
          </button>

          {showScript && (
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              {/* Terminal header */}
              <div className="mb-2 flex items-center gap-1.5">
                <span className="font-mono text-xs text-green-400">$&gt;</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                  shill_script.txt
                </span>
              </div>
              <p className="mb-3 font-mono text-xs leading-relaxed text-neutral-300">
                {job.shillScript}
              </p>
              <button
                type="button"
                onClick={onCopy}
                className={`rounded px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white transition-all active:scale-95 ${
                  copied
                    ? "bg-green-600 shadow-sm shadow-green-600/30"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {copied ? "✓ COPIED" : "COPY TO CLIPBOARD"}
              </button>
            </div>
          )}

          {/* Clock in with this role */}
          <a
            href="#clock-in"
            className="block w-full rounded border border-neutral-800 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-400 transition-all hover:border-blue-500/50 hover:text-blue-400"
          >
            → APPLY FOR THIS ROLE
          </a>
        </div>
      </div>
    </div>
  );
}
