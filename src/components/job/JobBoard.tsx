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
    title: "Meme Department Head",
    role: "designer",
    emoji: "🎨",
    multiplier: "1.5x",
    multiplierColor: "bg-purple-600",
    description: "Create viral content that makes people feel seen.",
    tasks: [
      "Ship at least 3 original memes per day",
      "Remix trending formats with $JOB lore",
      "Post reaction content when markets move",
    ],
    shillScript:
      "My boss got replaced by AI. My degree is worthless. But $JOB just hired me and I get paid hourly just for holding. The economy is fixed. 😭 $JOB",
  },
  {
    id: 3,
    title: "Night Shift Analyst",
    role: "engineer",
    emoji: "⚡",
    multiplier: "3x",
    multiplierColor: "bg-yellow-500",
    description: "Hold down the fort while the US sleeps.",
    tasks: [
      "Post during Asia/EU market hours",
      "Engage with international $JOB community",
      "Share updates across multiple time zones",
    ],
    shillScript:
      "gm from the $JOB night shift. been here since 3am. no one told me to. i just love my job. 🌙 $JOB hiring now — all shifts available",
  },
  {
    id: 4,
    title: "Head of HR",
    role: "operations",
    emoji: "📋",
    multiplier: "1x",
    multiplierColor: "bg-neutral-600",
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
    title: "Product Manager",
    role: "product",
    emoji: "🗓️",
    multiplier: "1.5x",
    multiplierColor: "bg-teal-600",
    description: "Build and ship the $JOB roadmap narrative.",
    tasks: [
      "Create $JOB roadmap threads",
      "Document all milestones publicly",
      "Champion community feature requests",
    ],
    shillScript:
      "Product update: $JOB payroll live. KPIs up. Only metric that matters: are you employed? Check your wallet. $JOB",
  },
  {
    id: 6,
    title: "C-Suite Executive",
    role: "leadership",
    emoji: "👑",
    multiplier: "2x",
    multiplierColor: "bg-amber-600",
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
    title: "Undying Loyalist",
    role: "other",
    emoji: "🔥",
    multiplier: "UNFIREABLE",
    multiplierColor: "bg-red-600",
    description: "You hold through everything. You ARE $JOB.",
    tasks: [
      "Never sell, no matter what",
      "Post 'I still hold' when price drops",
      "Be the last one standing",
    ],
    shillScript:
      "price down 90%. i still hold $JOB. they said i was crazy. they said crypto is dead. i said good. now i'm the only one left with a job. 💙",
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
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Open Positions
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Job Board
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-neutral-400">
            Pick your role. Copy the shill script. Clock in. Get paid.
          </p>
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

  return (
    <div className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 transition-all hover:border-neutral-600 hover:bg-neutral-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <span className="text-2xl">{job.emoji}</span>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-white">
            {job.title}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 capitalize">{job.role}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white ${job.multiplierColor}`}
        >
          {job.multiplier}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-xs leading-relaxed text-neutral-400">
        {job.description}
      </p>

      {/* Tasks */}
      <ul className="mb-5 flex-1 space-y-1.5">
        {job.tasks.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
            <span className="mt-0.5 shrink-0 text-blue-500">▸</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="space-y-2">
        {/* Shill script toggle */}
        <button
          type="button"
          onClick={() => setShowScript((v) => !v)}
          className="w-full rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
        >
          {showScript ? "Hide script" : "Show shill script"}
        </button>

        {showScript && (
          <div className="rounded-lg bg-neutral-950 p-3">
            <p className="mb-2 text-xs leading-relaxed text-neutral-300">
              {job.shillScript}
            </p>
            <button
              type="button"
              onClick={onCopy}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* Clock in with this role */}
        <a
          href={`#clock-in`}
          className="block w-full rounded-lg bg-neutral-800 px-3 py-2 text-center text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
        >
          Clock in as {job.role} →
        </a>
      </div>
    </div>
  );
}
