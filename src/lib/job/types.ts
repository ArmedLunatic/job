// ─── Employee Wall — core types ───────────────────────────────────────────────

/** Job roles shown on the wall card. */
export type Role =
  | "engineer"
  | "designer"
  | "product"
  | "operations"
  | "marketing"
  | "leadership"
  | "other";

/**
 * Decorative stamp overlaid on the generated card image.
 * Maps 1-to-1 to asset filenames in /public/stamps/.
 */
export type Stamp = "none" | "star" | "rocket" | "crown" | "lightning" | "heart";

/**
 * Row shape returned from the `employees` Supabase table.
 * Mirrors the schema defined in docs/employee-wall.md.
 */
export type EmployeeRow = {
  id: string;           // uuid primary key
  created_at: string;  // ISO-8601
  username: string;
  role: Role;
  stamp: Stamp;
  /** Public URL of the photo in the `employee-photos` storage bucket. */
  photo_url: string;
  /** Public URL of the generated card image — populated in Step 2. */
  card_url: string | null;
};
