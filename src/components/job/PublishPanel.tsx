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
      <div className="rounded-xl border border-green-800/40 bg-green-950/30 px-5 py-4">
        <p className="text-sm font-semibold text-green-400">
          You&apos;re on the wall! 🎉
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Your badge is live on the Employee Wall.
        </p>
        <Link
          href="/employees"
          className="mt-3 inline-block rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500 transition-colors"
        >
          View Employee Wall →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 py-5">
      <div>
        <p className="text-sm font-semibold text-white">Publish to Employee Wall</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          Optional — uploads images to a public gallery. Nothing is sent without your consent.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
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
        <p className="rounded-lg bg-red-950/40 border border-red-800/40 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={!consent || state === "uploading"}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "uploading" ? "Publishing…" : "Publish to Employee Wall"}
      </button>
    </div>
  );
}
