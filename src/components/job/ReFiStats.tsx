"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchAllRefiData,
  fmtSol,
  fmtRelativeTime,
  fmtAddress,
  REFI_CA,
  REFI_POLL_INTERVAL_MS,
} from "@/lib/refi/client";
import type { RefiData, RefiLoadState } from "@/lib/refi/types";

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ReFiStats() {
  const [data, setData] = useState<RefiData | null>(null);
  const [loadState, setLoadState] = useState<RefiLoadState>("idle");
  const firstLoad = useRef(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const result = await fetchAllRefiData();
        if (!cancelled) {
          setData(result);
          setLoadState("success");
          firstLoad.current = false;
        }
      } catch {
        if (!cancelled) setLoadState("error");
      }
    }

    setLoadState("loading");
    poll();
    const id = setInterval(poll, REFI_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const showSkeleton = loadState === "loading" && firstLoad.current;

  return (
    <section className="py-16 border-t border-neutral-800/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        {/* Section header */}
        <div>
          <p className="mb-1 font-mono text-[10px] tracking-widest uppercase text-neutral-600">
            DOC REF: PAYROLL-LIVE-001
          </p>
          <h2 className="font-mono text-lg font-bold tracking-tight text-white sm:text-xl uppercase">
            LIVE PAYROLL DATA — POWERED BY REFI.GG
          </h2>
        </div>

        {/* Embedded ReFi widget */}
        <ReFiIframeWidget />

        {/* Token stats bar */}
        <TokenStatsBar data={data} loading={showSkeleton} error={loadState === "error"} />

        {/* Cycle history */}
        <CycleHistoryTable data={data} loading={showSkeleton} error={loadState === "error"} />

        {/* Activity log */}
        <ActivityLogFeed data={data} loading={showSkeleton} error={loadState === "error"} />
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PanelProps {
  data: RefiData | null;
  loading: boolean;
  error: boolean;
}

function Unavailable() {
  return (
    <p className="font-mono text-xs text-red-500/60 py-6 text-center tracking-widest uppercase">
      [ DATA UNAVAILABLE ]
    </p>
  );
}

function SkeletonLine({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return (
    <div className={`${w} ${h} rounded animate-shimmer bg-neutral-800`} />
  );
}

// ── TokenStatsBar ──

function TokenStatsBar({ data, loading, error }: PanelProps) {
  const cells = [
    {
      label: "TOTAL DISTRIBUTED",
      value: data?.stats?.total_distributed != null
        ? fmtSol(data.stats.total_distributed)
        : null,
      color: "text-green-400",
    },
    {
      label: "REWARD CYCLES",
      value: data?.stats?.cycle_count != null
        ? String(data.stats.cycle_count)
        : null,
      color: "text-blue-400",
    },
    {
      label: "REWARD MODE",
      value: data?.stats?.reward_mode ?? null,
      color: "text-purple-400",
    },
    {
      label: "TOKEN",
      value: data?.stats?.symbol ?? null,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="portal-panel rounded-sm">
      <div className="portal-header">PAYROLL SUMMARY</div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className={`flex flex-col items-center justify-center py-5 px-4 text-center ${
              i > 0 ? "border-l border-neutral-800" : ""
            }`}
          >
            <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-neutral-600">
              {cell.label}
            </p>
            {loading ? (
              <SkeletonLine w="w-20" h="h-5" />
            ) : error || cell.value === null ? (
              <span className="font-mono text-xs text-red-500/60">—</span>
            ) : (
              <p className={`font-mono text-lg font-bold tabular-nums ${cell.color}`}>
                {cell.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CycleHistoryTable ──

function CycleHistoryTable({ data, loading, error }: PanelProps) {
  const cycles = data?.cycles ?? [];

  return (
    <div className="portal-panel rounded-sm">
      <div className="portal-header">CYCLE HISTORY — LAST 10</div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLine key={i} h="h-4" />
            ))}
          </div>
        ) : error || cycles.length === 0 ? (
          <Unavailable />
        ) : (
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-600 text-[10px] tracking-widest uppercase">
                <th className="py-2 px-3 text-left">DATE</th>
                <th className="py-2 px-3 text-right">DISTRIB</th>
                <th className="py-2 px-3 text-right">CLAIMED</th>
                <th className="py-2 px-3 text-right">HOLDERS</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-800/40 hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-2 px-3 text-neutral-500 whitespace-nowrap">
                    {fmtRelativeTime(c.timestamp)}
                  </td>
                  <td className="py-2 px-3 text-right text-green-400 tabular-nums whitespace-nowrap">
                    {fmtSol(c.sol_distributed)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-400 tabular-nums whitespace-nowrap">
                    {fmtSol(c.sol_claimed)}
                  </td>
                  <td className="py-2 px-3 text-right text-neutral-400 tabular-nums">
                    {c.holders_paid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── ActivityLogFeed ──

function ActivityLogFeed({ data, loading, error }: PanelProps) {
  const logs = data?.logs ?? [];

  return (
    <div className="portal-panel rounded-sm">
      <div className="portal-header">ACTIVITY LOG — LAST 60 EVENTS</div>
      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLine key={i} w={i % 3 === 0 ? "w-3/4" : "w-full"} h="h-3" />
          ))}
        </div>
      ) : error || logs.length === 0 ? (
        <Unavailable />
      ) : (
        <div className="max-h-64 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
          {logs.map((entry, i) => (
            <div key={i} className="flex gap-3 font-mono text-[11px] leading-relaxed">
              <span className="shrink-0 text-neutral-600 whitespace-nowrap">
                {fmtRelativeTime(entry.timestamp)}
              </span>
              <span className="text-neutral-400">{entry.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── LotteryHistoryPanel ──

function LotteryHistoryPanel({ data, loading, error }: PanelProps) {
  const draws = data?.lottery ?? [];

  return (
    <div className="portal-panel rounded-sm">
      <div className="portal-header">LOTTERY HISTORY — LAST 10</div>
      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLine key={i} h="h-4" />
          ))}
        </div>
      ) : error || draws.length === 0 ? (
        <Unavailable />
      ) : (
        <div className="divide-y divide-neutral-800/40">
          {draws.map((draw, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
                  DRAW #{draw.draw_number}
                </span>
                <span className="font-mono text-xs text-yellow-400 tabular-nums">
                  {fmtSol(draw.pot_size)}
                </span>
              </div>
              {draw.winners.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {draw.winners.map((w, j) => (
                    <span
                      key={j}
                      className="font-mono text-[10px] text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded-sm"
                    >
                      {fmtAddress(w)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="font-mono text-[10px] text-neutral-700">No winners</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ReFiIframeWidget ──

function ReFiIframeWidget() {
  return (
    <div className="portal-panel rounded-sm overflow-hidden">
      <div className="portal-header">REFI.GG — LIVE TOKEN WIDGET</div>
      <div className="p-4">
        <iframe
          src={`https://refi.gg/embed/${REFI_CA}`}
          width="100%"
          height="190"
          style={{ borderRadius: "12px", border: "none", display: "block" }}
          loading="lazy"
          title="ReFi Token Widget"
        />
      </div>
    </div>
  );
}
