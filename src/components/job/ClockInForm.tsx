"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Role, Stamp, AvatarSource } from "@/lib/job/types";
import {
  generateJobAlertCard,
  generateBadgePfp,
  type ImageGenResult,
} from "@/lib/job/image-gen";
import JobAlertPreview from "@/components/job/JobAlertPreview";
import BadgePreview from "@/components/job/BadgePreview";
import PublishPanel from "@/components/job/PublishPanel";

const ROLES: { value: Role; label: string }[] = [
  { value: "engineer", label: "Engineer" },
  { value: "designer", label: "Designer" },
  { value: "product", label: "Product Manager" },
  { value: "operations", label: "Operations" },
  { value: "marketing", label: "Marketing" },
  { value: "leadership", label: "Leadership" },
  { value: "other", label: "Other" },
];

const STAMPS: { value: Stamp; label: string; emoji: string }[] = [
  { value: "none", label: "None", emoji: "—" },
  { value: "rocket", label: "HIRED", emoji: "🚀" },
  { value: "heart", label: "UNFIREABLE", emoji: "❤️" },
  { value: "lightning", label: "NIGHT SHIFT", emoji: "⚡" },
  { value: "star", label: "ALL STAR", emoji: "⭐" },
  { value: "crown", label: "LEGEND", emoji: "👑" },
];

export default function ClockInForm() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("engineer");
  const [stamp, setStamp] = useState<Stamp>("none");
  const [avatarMode, setAvatarMode] = useState<"default" | "upload">("default");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [alertResult, setAlertResult] = useState<ImageGenResult | null>(null);
  const [badgeResult, setBadgeResult] = useState<ImageGenResult | null>(null);
  const [generating, setGenerating] = useState<"alert" | "badge" | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const canGenerate = username.trim().length >= 2;
  const avatarSource: AvatarSource =
    avatarMode === "upload" && avatarFile ? avatarFile : "default";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleGenAlert() {
    setGenerating("alert");
    setGenError(null);
    if (alertResult) URL.revokeObjectURL(alertResult.url);
    try {
      const result = await generateJobAlertCard({
        username,
        role,
        stamp,
        avatarSource,
      });
      setAlertResult(result);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenBadge() {
    setGenerating("badge");
    setGenError(null);
    if (badgeResult) URL.revokeObjectURL(badgeResult.url);
    try {
      const result = await generateBadgePfp({
        username,
        role,
        stamp,
        avatarSource,
      });
      setBadgeResult(result);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(null);
    }
  }

  const bothReady = alertResult !== null && badgeResult !== null;

  return (
    <section id="clock-in" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Step 1: Clock In
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Generate Your Badge
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-neutral-400">
            Everything happens on your device. Nothing leaves until you click
            Publish.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Form ─────────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@satoshi"
                maxLength={25}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600 focus:ring-1 focus:ring-white/10"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-neutral-600 focus:ring-1 focus:ring-white/10"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stamp */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Stamp
              </label>
              <div className="flex flex-wrap gap-2">
                {STAMPS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStamp(s.value)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      stamp === s.value
                        ? "border-blue-500 bg-blue-600/20 text-blue-300"
                        : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar source */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Avatar
              </label>

              {/* Mode toggle */}
              <div className="flex gap-2">
                {(["default", "upload"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAvatarMode(m)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      avatarMode === m
                        ? "border-blue-500 bg-blue-600/20 text-blue-300"
                        : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                    }`}
                  >
                    {m === "default" ? "Use $JOB mascot" : "Upload your PFP"}
                  </button>
                ))}
              </div>

              {/* Default mascot preview */}
              {avatarMode === "default" && (
                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-neutral-700">
                    <Image
                      src="/job/job-icon.png"
                      alt="$JOB mascot"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-300">
                      $JOB Mascot
                    </p>
                    <p className="text-xs text-neutral-600">
                      Default avatar for your badge
                    </p>
                  </div>
                </div>
              )}

              {/* File upload */}
              {avatarMode === "upload" && (
                <label
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900 py-8 transition-colors hover:border-neutral-500"
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-neutral-600">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="avatar preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                  <span className="text-sm text-neutral-400">
                    {avatarFile ? avatarFile.name : "Click to select a photo"}
                  </span>
                  <span className="text-xs text-neutral-600">
                    PNG, JPEG, or WebP — max 4 MB
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* Error */}
            {genError && (
              <p className="rounded-xl border border-red-800/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {genError}
              </p>
            )}

            {/* Generate buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!canGenerate || generating !== null}
                onClick={handleGenAlert}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {generating === "alert" ? (
                  <>
                    <Spinner /> Generating…
                  </>
                ) : (
                  "Generate Job Alert"
                )}
              </button>

              <button
                type="button"
                disabled={!canGenerate || generating !== null}
                onClick={handleGenBadge}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {generating === "badge" ? (
                  <>
                    <Spinner /> Generating…
                  </>
                ) : (
                  "Generate Badge PFP"
                )}
              </button>
            </div>

            {/* Publish panel */}
            {bothReady && (
              <PublishPanel
                username={username}
                role={role}
                stamp={stamp}
                jobAlertBlob={alertResult!.blob}
                badgeBlob={badgeResult!.blob}
              />
            )}
          </div>

          {/* ── Previews ──────────────────────────────────────────────────────── */}
          <div className="space-y-8">
            {alertResult || badgeResult ? (
              <>
                <JobAlertPreview result={alertResult} />
                <BadgePreview result={badgeResult} />
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-neutral-800 text-sm text-neutral-700">
                Previews appear here after generation
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8"
        strokeLinecap="round"
      />
    </svg>
  );
}
