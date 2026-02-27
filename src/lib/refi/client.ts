import type {
  RefiTokenStats,
  RefiCycle,
  RefiLogEntry,
  RefiData,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const REFI_BASE_URL = "https://refi.gg/api/public/tokens";
export const REFI_CA = "12yc14qer8X8kb3mn5S6LDZy4oKwe2uVdME4LJ2qpump";
export const REFI_POLL_INTERVAL_MS = 30_000;

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function refiGet<T>(path: string): Promise<T> {
  const url = `${REFI_BASE_URL}/${REFI_CA}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ReFi API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Endpoint fetchers ─────────────────────────────────────────────────────
// Each fetcher maps the raw API shape → our clean internal type.
// Raw shapes confirmed from live API 2026-02-27.

// GET / → { token: { symbol, name, imageUrl, rewardMode, ... }, stats: { total_cycles, total_distributed, ... } }
export async function fetchTokenStats(): Promise<RefiTokenStats> {
  const raw = await refiGet<{
    token: {
      symbol: string;
      name: string;
      imageUrl: string;
      rewardMode: string;
    };
    stats: {
      total_cycles: number | null;
      total_distributed: string | null;
    };
  }>("");
  return {
    symbol: raw.token.symbol,
    name: raw.token.name,
    image: raw.token.imageUrl,
    total_distributed: raw.stats.total_distributed != null
      ? parseFloat(raw.stats.total_distributed)
      : 0,
    cycle_count: raw.stats.total_cycles ?? 0,
    reward_mode: raw.token.rewardMode,
  };
}

// GET /cycles → { cycles: Array<{ sol_claimed, sol_distributed, holders_paid, timestamp }> }
export async function fetchCycles(limit = 10): Promise<RefiCycle[]> {
  const raw = await refiGet<{
    cycles: Array<{
      sol_claimed?: number;
      sol_distributed?: number;
      holders_paid?: number;
      timestamp?: string;
      // camelCase fallbacks in case API uses those
      solClaimed?: number;
      solDistributed?: number;
      holdersPaid?: number;
    }>;
  }>(`/cycles?limit=${limit}`);
  return (raw.cycles ?? []).map((c) => ({
    sol_claimed: c.sol_claimed ?? c.solClaimed ?? 0,
    sol_distributed: c.sol_distributed ?? c.solDistributed ?? 0,
    holders_paid: c.holders_paid ?? c.holdersPaid ?? 0,
    timestamp: c.timestamp ?? "",
  }));
}

// GET /logs → { logs: Array<{ ts (ISO), level, message }> }
export async function fetchLogs(): Promise<RefiLogEntry[]> {
  const raw = await refiGet<{
    logs: Array<{ ts: string; level?: string; message: string }>;
  }>("/logs?limit=60");
  return (raw.logs ?? []).map((e) => ({
    message: e.message,
    timestamp: e.ts,
  }));
}

// ─── Aggregate fetch (partial failure resilient) ──────────────────────────────

export async function fetchAllRefiData(): Promise<RefiData> {
  const [statsResult, cyclesResult, logsResult] =
    await Promise.allSettled([
      fetchTokenStats(),
      fetchCycles(10),
      fetchLogs(),
    ]);

  return {
    stats: statsResult.status === "fulfilled" ? statsResult.value : null,
    cycles: cyclesResult.status === "fulfilled" ? cyclesResult.value : [],
    lottery: [],
    logs: logsResult.status === "fulfilled" ? logsResult.value : [],
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Format a SOL amount, e.g. "12.45 SOL" */
export function fmtSol(sol: number): string {
  if (sol === 0) return "0 SOL";
  if (sol >= 1000) return `${(sol / 1000).toFixed(2)}K SOL`;
  if (sol >= 1) return `${sol.toFixed(2)} SOL`;
  return `${sol.toFixed(4)} SOL`;
}

/** Relative time from ISO string, e.g. "3h ago" */
export function fmtRelativeTime(iso: string): string {
  if (!iso) return "—";
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
