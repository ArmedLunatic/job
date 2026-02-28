import Link from "next/link";
import { Tweet } from "react-tweet";
import { LORE, type LoreEntry } from "@/lib/job/lore";

type Props = {
  preview?: boolean;
};

export default function LoreWall({ preview = false }: Props) {
  const entries = preview ? LORE.slice(0, 6) : LORE;

  return (
    <section id="lore-wall" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
              Evidence Archive
            </p>
            <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
              LORE WALL
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              AI DISPLACEMENT RECORDS // RECEIPTS FROM THE TIMELINE
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-900/60 bg-amber-950/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-600/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {LORE.length} RECORD{LORE.length !== 1 ? "S" : ""} ON FILE
          </span>
        </div>

        {/* Empty state */}
        {LORE.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded border border-neutral-800 border-l-4 border-l-amber-800/60 bg-neutral-900/40 py-20 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-600">
              ARCHIVE STATUS
            </p>
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-neutral-500">
              NO RECORDS ON FILE
            </p>
            <p className="mt-2 text-xs text-neutral-700">
              Add tweet IDs to src/lib/job/lore.ts to populate the archive
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <LoreCard key={entry.id} entry={entry} />
              ))}
            </div>

            {/* Preview CTA */}
            {preview && LORE.length > 6 && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/lore"
                  className="inline-flex items-center gap-2 rounded border border-amber-800/50 bg-amber-950/20 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-amber-500/80 transition-all hover:border-amber-600/60 hover:bg-amber-950/40 hover:text-amber-400 active:scale-95"
                >
                  VIEW FULL ARCHIVE →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function LoreCard({ entry }: { entry: LoreEntry }) {
  return (
    <div className="flex flex-col rounded border border-neutral-800 bg-neutral-950 overflow-hidden transition-colors hover:border-neutral-700">
      {/* Tweet embed — dark theme via data attribute */}
      <div data-theme="dark" className="flex justify-center [&_.react-tweet-theme]:w-full [&_.react-tweet-theme]:max-w-none [&_.react-tweet-theme]:rounded-none [&_.react-tweet-theme]:border-0 [&_.react-tweet-theme]:shadow-none">
        <Tweet id={entry.tweetId} />
      </div>

      {/* Optional editorial note */}
      {entry.caption && (
        <div className="border-t border-neutral-800 px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600/70 leading-relaxed">
            // {entry.caption}
          </p>
        </div>
      )}
    </div>
  );
}
