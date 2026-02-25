// ─── Employee Wall — core types ───────────────────────────────────────────────

export type Role =
  | "engineer"
  | "designer"
  | "product"
  | "operations"
  | "marketing"
  | "leadership"
  | "other";

export type Stamp = "none" | "star" | "rocket" | "crown" | "lightning" | "heart";

/** File to upload, or "default" to use the mascot icon */
export type AvatarSource = File | "default";

/**
 * Row shape returned from the `employees` Supabase table.
 */
export type EmployeeRow = {
  id: string;
  created_at: string;
  username: string;
  role: Role;
  stamp: Stamp;
  badge_url: string;
  job_card_url: string;
  consent: boolean;
};
