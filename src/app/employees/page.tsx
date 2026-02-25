import Link from "next/link";
import EmployeeGrid from "@/components/job/EmployeeGrid";

export const metadata = {
  title: "Employee Wall — $JOB",
  description: "Browse everyone who clocked in and published their $JOB badge.",
  openGraph: {
    title: "Employee Wall — $JOB",
    description: "Browse everyone who clocked in and published their $JOB badge.",
    type: "website" as const,
  },
};

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-2 inline-block text-xs text-neutral-600 transition-colors hover:text-neutral-400"
            >
              ← Back to home
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Employee Wall
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Everyone who clocked in and went public.
            </p>
          </div>
          <Link
            href="/#clock-in"
            className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            + Clock In
          </Link>
        </div>

        {/* Grid */}
        <EmployeeGrid />
      </div>
    </main>
  );
}
