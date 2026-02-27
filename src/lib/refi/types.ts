// ReFi public API — TypeScript interfaces
// Field names are normalized from raw API camelCase/snake_case to consistent snake_case.
// Raw API mapping is handled in client.ts.

export interface RefiTokenStats {
  symbol: string;
  name: string;
  image: string;
  total_distributed: number; // SOL, 0 when no cycles yet
  cycle_count: number;
  reward_mode: string; // e.g. "lottery"
  interval_sec: number; // payout interval in seconds, e.g. 300 = 5 min
}

export interface RefiCycle {
  sol_claimed: number;
  sol_distributed: number;
  holders_paid: number;
  timestamp: string; // ISO 8601
}

export interface RefiLotteryDraw {
  draw_number: number;
  winners: string[]; // wallet addresses (extracted from winners[].address)
  pot_size: number;  // SOL (parsed from potSol string)
  seed_hash: string; // seedHex from API
  timestamp?: string; // drawnAt from API
}

export interface RefiLogEntry {
  message: string;
  timestamp: string; // mapped from "ts" field in API
}

export interface RefiData {
  stats: RefiTokenStats | null;
  cycles: RefiCycle[];
  lottery: RefiLotteryDraw[];
  logs: RefiLogEntry[];
}

export type RefiLoadState = "idle" | "loading" | "success" | "error";
