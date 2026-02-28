import Link from "next/link";
import { Tweet } from "react-tweet";
import { LORE, type LoreEntry } from "@/lib/job/lore";

type Props = {
  preview?: boolean;
};

export default function LoreWall({ preview = false }: Props) {
  const entries = preview ? LORE.slice(0, 6) : LORE;

  return (
    <section id="lore-wall" className="relative w-full py-24 overflow-hidden">
      {/* Ambient amber warmth — very subtle */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(245,158,11,0.035) 0%, transparent 65%)",
        }}
      />
      {/* Section top rule */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* Eyebrow */}
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-500/70">
                Evidence Archive
              </span>
              <span className="font-mono text-[10px] text-neutral-800 tracking-widest">
                ·&nbsp;CLASSIFIED
              </span>
            </div>
            {/* Title */}
            <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
              LORE WALL
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-700">
              AI DISPLACEMENT RECORDS // RECEIPTS FROM THE TIMELINE
            </p>
          </div>

          {/* Count badge */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-amber-900/50 bg-amber-950/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-600/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/60" />
              {LORE.length} EXHIBIT{LORE.length !== 1 ? "S" : ""} ON FILE
            </span>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────────── */}
        <div className="mb-10 h-px bg-gradient-to-r from-amber-900/20 via-neutral-800/60 to-transparent" />

        {/* ── Content ─────────────────────────────────────────────────────────── */}
        {LORE.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="lore-masonry">
              {entries.map((entry, i) => (
                <div key={entry.id} className="lore-masonry-item">
                  <LoreCard entry={entry} index={i} />
                </div>
              ))}
            </div>

            {preview && LORE.length > 6 && (
              <div className="mt-12 flex justify-center">
                <Link
                  href="/lore"
                  className="group inline-flex items-center gap-3 rounded border border-amber-800/40 bg-amber-950/10 px-8 py-3 font-mono text-[10px] uppercase tracking-widest text-amber-600/60 transition-all duration-200 hover:border-amber-700/60 hover:bg-amber-950/25 hover:text-amber-400 active:scale-95"
                >
                  <span className="h-1 w-4 bg-amber-800/50 transition-colors group-hover:bg-amber-500/60" />
                  VIEW FULL ARCHIVE
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-neutral-800 border-l-2 border-l-amber-900/40 bg-neutral-900/20 py-20 text-center">
      <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700">
        ARCHIVE STATUS
      </p>
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-600">
        NO RECORDS ON FILE
      </p>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-neutral-800">
        ADD TWEET IDs TO src/lib/job/lore.ts
      </p>
    </div>
  );
}

function LoreCard({ entry, index }: { entry: LoreEntry; index: number }) {
  const exhibitNum = `EXH-${String(index + 1).padStart(3, "0")}`;

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-800/70 bg-[#0d0d0d] transition-all duration-200 hover:border-neutral-700/60 hover:shadow-lg hover:shadow-black/50">
      {/* Card chrome bar */}
      <div className="flex items-center justify-between border-b border-neutral-800/50 bg-neutral-900/50 px-3 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-700">
          {exhibitNum}
        </span>
        {entry.caption ? (
          <span className="max-w-[60%] truncate font-mono text-[9px] uppercase tracking-widest text-amber-700/50">
            {entry.caption}
          </span>
        ) : (
          <span className="font-mono text-[9px] text-neutral-800 select-none">· · ·</span>
        )}
      </div>

      {/* Tweet — CSS vars in globals.css drive the theming */}
      <div data-theme="dark">
        <Tweet id={entry.tweetId} />
      </div>
    </div>
  );
}
