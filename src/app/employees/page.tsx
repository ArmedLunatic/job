// Step 1 placeholder — Supabase fetch + card grid wired in Step 3.

import Link from "next/link";

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employee Wall</h1>
            <p className="text-sm text-neutral-400 mt-0.5">All published cards.</p>
          </div>
          <Link
            href="/employee-wall"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200 transition-colors"
          >
            + Add yours
          </Link>
        </div>

        {/* Placeholder — fetch wired in Step 3 */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-800 py-24 text-center">
          <span className="text-4xl opacity-20">🖼️</span>
          <p className="text-sm text-neutral-500">No employees yet.</p>
          <p className="text-xs text-neutral-700">Supabase fetch wired in Step 3.</p>
        </div>
      </div>
    </main>
  );
}
