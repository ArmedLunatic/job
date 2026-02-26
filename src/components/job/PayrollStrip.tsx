"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const id = setInterval(() => setSecs(secondsToNextHour()), 1000);
    return () => clearInterval(id);
  }, []);

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

          {/* Ticker cells */}
          <Ticker label="PAYROLL" value="$12,450/hr" color="text-green-400" />
          <Ticker label="WAGE" value="$0.00042 / 1M $JOB" color="text-blue-400" />
          <Ticker label="NEXT PAYROLL" value={fmt(secs)} color="text-yellow-400" flash />
          <Ticker label="VOL" value="—" color="text-neutral-500" />
        </div>

        {/* Right: disclaimer */}
        <span className="hidden items-center border-l border-neutral-800 px-3 py-1.5 text-[10px] text-neutral-700 sm:flex whitespace-nowrap tracking-widest uppercase font-mono">
          ESTIMATED · DATA PENDING
        </span>
      </div>
    </div>
  );
}

function Ticker({
  label,
  value,
  color,
  flash,
}: {
  label: string;
  value: string;
  color: string;
  flash?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 border-r border-neutral-800 px-3 py-1.5">
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
