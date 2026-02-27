import { NextResponse } from "next/server";

const BASE = "https://refi.gg/api/public/tokens";
const CA = "12yc14qer8X8kb3mn5S6LDZy4oKwe2uVdME4LJ2qpump";

export const dynamic = "force-dynamic";

export async function GET() {
  const get = (path: string) =>
    fetch(`${BASE}/${CA}${path}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

  const [stats, cycles, logs] = await Promise.all([
    get(""),
    get("/cycles?limit=10"),
    get("/logs?limit=60"),
  ]);

  return NextResponse.json({ stats, cycles, logs });
}
