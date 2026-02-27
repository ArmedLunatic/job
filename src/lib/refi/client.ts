import type {
  RefiTokenStats,
  RefiCycle,
  RefiLotteryDraw,
  RefiLogEntry,
  RefiData,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const REFI_BASE_URL = "https://refi.gg/api/public/tokens";
export const REFI_CA = "QQ2FpXD65ni9nrxpkEJFG4RMstzCKGMUp1Lqwzipump";
export const REFI_POLL_INTERVAL_MS = 30_000;

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function refiGet<T>(path: string): Promise<T> {
  const url = `${REFI_BASE_URL}/${REFI_CA}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ReFi API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Endpoint fetchers ────────────────────────────────────────────────────────

export async function fetchTokenStats(): Promise<RefiTokenStats> {
  return refiGet<RefiTokenStats>("");
}

export async function fetchCycles(limit = 10): Promise<RefiCycle[]> {
  return refiGet<RefiCycle[]>(`/cycles?limit=${limit}`);
}

export async function fetchLottery(limit = 10): Promise<RefiLotteryDraw[]> {
  return refiGet<RefiLotteryDraw[]>(`/lottery?limit=${limit}`);
}

export async function fetchLogs(): Promise<RefiLogEntry[]> {
  return refiGet<RefiLogEntry[]>("/logs?limit=60");
}

// ─── Aggregate fetch (partial failure resilient) ──────────────────────────────

export async function fetchAllRefiData(): Promise<RefiData> {
  const [statsResult, cyclesResult, lotteryResult, logsResult] =
    await Promise.allSettled([
      fetchTokenStats(),
      fetchCycles(10),
      fetchLottery(10),
      fetchLogs(),
    ]);

  return {
    stats: statsResult.status === "fulfilled" ? statsResult.value : null,
    cycles: cyclesResult.status === "fulfilled" ? cyclesResult.value : [],
    lottery: lotteryResult.status === "fulfilled" ? lotteryResult.value : [],
    logs: logsResult.status === "fulfilled" ? logsResult.value : [],
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Format a SOL number to a readable string, e.g. "12.45 SOL" */
export function fmtSol(sol: number): string {
  if (sol === 0) return "0 SOL";
  if (sol >= 1000) return `${(sol / 1000).toFixed(2)}K SOL`;
  if (sol >= 1) return `${sol.toFixed(2)} SOL`;
  return `${sol.toFixed(4)} SOL`;
}

/** Relative time from ISO string, e.g. "3h ago" */
export function fmtRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/** Truncate a wallet address, e.g. "QQ2F…pump" */
export function fmtAddress(addr: string): string {
  if (!addr || addr.length <= 12) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}
