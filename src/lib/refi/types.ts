// ReFi public API — TypeScript interfaces

export interface RefiTokenStats {
  symbol: string;
  name: string;
  image: string;
  total_distributed: number; // SOL
  cycle_count: number;
  reward_mode: string;
}

export interface RefiCycle {
  sol_claimed: number;
  sol_distributed: number;
  holders_paid: number;
  timestamp: string; // ISO 8601
}

export interface RefiLotteryDraw {
  draw_number: number;
  winners: string[]; // wallet addresses
  pot_size: number; // SOL
  seed_hash: string;
  timestamp?: string;
}

export interface RefiLogEntry {
  message: string;
  timestamp: string; // ISO 8601
}

export interface RefiData {
  stats: RefiTokenStats | null;
  cycles: RefiCycle[];
  lottery: RefiLotteryDraw[];
  logs: RefiLogEntry[];
}

export type RefiLoadState = "idle" | "loading" | "success" | "error";
