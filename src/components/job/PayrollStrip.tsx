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
    <div className="sticky top-0 z-40 border-b border-neutral-800/60 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-4 py-2 sm:px-6">
        <div className="flex items-center gap-5 text-xs font-mono whitespace-nowrap">
          <Ticker label="PAYROLL" value="$12,450/hr" color="text-green-400" />
          <Ticker label="WAGE" value="$0.00042 / 1M $JOB" color="text-blue-400" />
          <Ticker label="NEXT PAYROLL" value={fmt(secs)} color="text-yellow-400" />
          <Ticker label="VOL" value="—" color="text-neutral-400" />
        </div>
        <span className="hidden text-xs text-neutral-600 sm:block whitespace-nowrap">
          estimates · DEX data coming soon
        </span>
      </div>
    </div>
  );
}

function Ticker({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <span>
      <span className="text-neutral-600 mr-1.5">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </span>
  );
}
