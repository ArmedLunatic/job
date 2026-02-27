"use client";

import { useState, useEffect } from "react";
import {
  fetchAllRefiData,
  fmtSol,
  REFI_POLL_INTERVAL_MS,
} from "@/lib/refi/client";
import type { RefiData, RefiLoadState } from "@/lib/refi/types";

function secondsToNextHour(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(now.getHours() + 1, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

function fmt(secs: number): string {
  const h = Math.floor(secs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function PayrollStrip() {
  const [secs, setSecs] = useState(secondsToNextHour());
  const [data, setData] = useState<RefiData | null>(null);
  const [loadState, setLoadState] = useState<RefiLoadState>("idle");

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => setSecs(secondsToNextHour()), 1000);
    return () => clearInterval(id);
  }, []);

  // ReFi API polling
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (loadState === "idle") setLoadState("loading");
      try {
        const result = await fetchAllRefiData();
        if (!cancelled) {
          setData(result);
          setLoadState("success");
        }
      } catch {
        if (!cancelled) setLoadState("error");
      }
    }

    poll();
    const id = setInterval(poll, REFI_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = loadState === "idle" || loadState === "loading";
  const isError = loadState === "error";

  const lastCycleSol =
    data?.cycles?.[0]?.sol_distributed != null
      ? fmtSol(data.cycles[0].sol_distributed)
      : isLoading
      ? "..."
      : "—";

  const totalDistSol =
    data?.stats?.total_distributed != null
      ? fmtSol(data.stats.total_distributed)
      : isLoading
      ? "..."
      : "—";

  const cycleCount =
    data?.stats?.cycle_count != null
      ? `#${data.stats.cycle_count}`
      : isLoading
      ? "..."
      : "—";

  let disclaimer = "ESTIMATED · DATA PENDING";
  if (loadState === "loading") disclaimer = "LOADING · REFI API";
  else if (loadState === "success") disclaimer = "LIVE · REFI.GG";
  else if (loadState === "error") disclaimer = "ESTIMATED · API ERR";

  return (
    <div
      className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950"
      style={{ borderTop: "2px solid rgba(74,222,128,0.45)" }}
    >
      <div className="mx-auto flex max-w-7xl items-stretch justify-between overflow-x-auto">
        {/* Left: LIVE indicator + tickers */}
        <div className="flex items-stretch font-mono text-xs whitespace-nowrap">
          {/* LIVE indicator cell */}
          <div className="flex items-center gap-1.5 border-r border-neutral-800 px-3 py-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-live-blip"
              aria-hidden="true"
            />
            <span className="text-green-400 font-semibold tracking-wider text-[10px] uppercase">
              Live
            </span>
          </div>

          {/* Ticker cells — hide lower-priority ones on mobile to prevent overflow */}
          <Ticker label="LAST CYCLE" value={lastCycleSol} color="text-green-400" />
          <Ticker label="TOTAL DIST" value={totalDistSol} color="text-blue-400" className="hidden sm:inline-flex" />
          <Ticker label="CYCLES" value={cycleCount} color="text-purple-400" className="hidden sm:inline-flex" />
          <Ticker label="NEXT PAYROLL" value={fmt(secs)} color="text-yellow-400" flash />
        </div>

        {/* Right: disclaimer (sm+ only) + buy link (always visible) */}
        <div className="flex items-stretch">
          <span
            className={`hidden sm:flex items-center border-l border-neutral-800 px-3 py-1.5 text-[10px] whitespace-nowrap tracking-widest uppercase font-mono ${
              isError ? "text-red-500/70" : "text-neutral-700"
            }`}
          >
            {disclaimer}
          </span>
          <a
            href="https://runnr.trade/token/QQ2FpXD65ni9nrxpkEJFG4RMstzCKGMUp1Lqwzipump?ref=ash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border-l border-neutral-800 px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase text-green-500/60 whitespace-nowrap transition-colors hover:text-green-400"
          >
            Buy ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function Ticker({
  label,
  value,
  color,
  flash,
  className,
}: {
  label: string;
  value: string;
  color: string;
  flash?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 border-r border-neutral-800 px-3 py-1.5 ${className ?? ""}`}>
      <span className="text-neutral-600 tracking-widest text-[10px] uppercase">
        [{label}]
      </span>
      <span
        className={`font-semibold tabular-nums ${color} ${flash ? "animate-tick-flash" : ""}`}
      >
        {value}
      </span>
    </span>
  );
}
