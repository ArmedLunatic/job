"use client";

import { useEffect } from "react";
import type { ImageGenResult } from "@/lib/job/image-gen";

type Props = { result: ImageGenResult | null };

export default function JobAlertPreview({ result }: Props) {
  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  if (!result) return null;

  function download() {
    const a = document.createElement("a");
    a.href = result!.url;
    a.download = "job-alert.png";
    a.click();
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Job Alert Card · 1200 × 675
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.url}
        alt="Job Alert Card preview"
        className="w-full rounded-xl border border-neutral-800 shadow-lg"
      />
      <button
        type="button"
        onClick={download}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
      >
        ↓ Download PNG
      </button>
    </div>
  );
}
