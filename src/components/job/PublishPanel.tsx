"use client";

import { useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { Stamp } from "@/lib/job/types";

type Props = {
  username: string;
  role: string;
  stamp: Stamp;
  jobAlertBlob: Blob;
  badgeBlob: Blob;
};

export default function PublishPanel({
  username,
  role,
  stamp,
  jobAlertBlob,
  badgeBlob,
}: Props) {
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  async function handlePublish() {
    if (!consent) return;
    setState("uploading");
    setError(null);

    try {
      const sb = getClient();
      const ts = Date.now();
      const slug = username.replace(/^@/, "").toLowerCase();

      const badgePath = `${slug}/${ts}-badge.png`;
      const alertPath = `${slug}/${ts}-job-alert.png`;

      const [r1, r2] = await Promise.all([
        sb.storage
          .from("pfps")
          .upload(badgePath, badgeBlob, { contentType: "image/png" }),
        sb.storage
          .from("pfps")
          .upload(alertPath, jobAlertBlob, { contentType: "image/png" }),
      ]);

      if (r1.error) throw new Error(`Badge upload: ${r1.error.message}`);
      if (r2.error) throw new Error(`Alert upload: ${r2.error.message}`);

      const badgeUrl = sb.storage
        .from("pfps")
        .getPublicUrl(badgePath).data.publicUrl;
      const alertUrl = sb.storage
        .from("pfps")
        .getPublicUrl(alertPath).data.publicUrl;

      const { error: dbErr } = await sb.from("employees").insert({
        username: slug,
        role,
        stamp,
        badge_url: badgeUrl,
        job_card_url: alertUrl,
        consent: true,
      });

      if (dbErr) throw new Error(dbErr.message);

      setState("done");
      toast("Published to Employee Wall! 🎉");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Publish failed";
      setError(msg);
      setState("error");
      toast(msg, "error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded border border-green-800 bg-green-950/30 px-5 py-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-green-400">
          SUBMISSION CONFIRMED
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Your badge is live on the Employee Wall.
        </p>
        <Link
          href="/employees"
          className="mt-3 inline-block rounded border border-green-700 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-green-400 transition-colors hover:bg-green-900/30"
        >
          VIEW EMPLOYEE RECORDS →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded border border-neutral-800 bg-neutral-900/50 px-5 py-5">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          SECTION 05 — RECORD SUBMISSION
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Optional — uploads images to a public gallery. Nothing is sent without your consent.
        </p>
      </div>

      {/* Consent signature block */}
      <label className="flex cursor-pointer items-start gap-3 border-b border-dashed border-neutral-700 pb-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-800 accent-blue-600"
        />
        <span className="text-xs text-neutral-400 leading-relaxed">
          I consent to my username, role, and generated images being displayed
          publicly on the Employee Wall.
        </span>
      </label>

      {error && (
        <p className="rounded border border-red-800/40 bg-red-950/40 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={!consent || state === "uploading"}
        className="w-full rounded bg-blue-600 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "uploading" ? "SUBMITTING…" : "SUBMIT TO EMPLOYEE WALL"}
      </button>
    </div>
  );
}
