"use client";

// Step 1 placeholder — canvas generation & publish wired in Step 2.

import { useState } from "react";
import Link from "next/link";
import type { Role, Stamp } from "@/lib/job/types";

const ROLES: Role[] = [
  "engineer", "designer", "product",
  "operations", "marketing", "leadership", "other",
];

const STAMPS: Stamp[] = ["none", "star", "rocket", "crown", "lightning", "heart"];

export default function EmployeeWallUploadPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("engineer");
  const [stamp, setStamp] = useState<Stamp>("none");
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Employee Wall</h1>
          <p className="text-sm text-neutral-400">Generate and publish your card.</p>
        </div>

        <div className="space-y-5">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jane.doe"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/30"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stamp */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Stamp
            </label>
            <div className="flex flex-wrap gap-2">
              {STAMPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStamp(s)}
                  className={`rounded-md border px-3 py-1.5 text-xs capitalize transition-colors ${
                    stamp === s
                      ? "border-white bg-white text-neutral-950 font-medium"
                      : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Photo
            </label>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-900 py-8 text-sm text-neutral-400 hover:text-white transition-colors">
              <span className="text-2xl">📷</span>
              <span>{file ? file.name : "Click to select a photo"}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* Actions — disabled until Step 2 */}
          <div className="flex gap-3 pt-2">
            <button
              disabled
              title="Coming in Step 2"
              className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 opacity-30 cursor-not-allowed"
            >
              Generate Card
            </button>
            <button
              disabled
              title="Coming in Step 2"
              className="flex-1 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-400 opacity-30 cursor-not-allowed"
            >
              Publish
            </button>
          </div>

          <p className="text-center text-xs text-neutral-600">
            Canvas generation &amp; publish coming in Step 2.
          </p>
        </div>

        <p className="text-center text-xs text-neutral-600">
          <Link href="/employees" className="underline underline-offset-2 hover:text-neutral-400">
            View employee wall →
          </Link>
        </p>
      </div>
    </main>
  );
}
