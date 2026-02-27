import Link from "next/link";
import EmployeeGrid from "@/components/job/EmployeeGrid";

export const metadata = {
  title: "Employee Wall — $JOB",
  description: "Browse everyone who clocked in and published their $JOB badge.",
  openGraph: {
    title: "Employee Wall — $JOB",
    description: "Browse everyone who clocked in and published their $JOB badge.",
    type: "website" as const,
    images: [{ url: "/job/job-icon.png", width: 512, height: 512, alt: "$JOB" }],
  },
  twitter: {
    card: "summary",
    title: "Employee Wall — $JOB",
    description: "Browse everyone who clocked in and published their $JOB badge.",
    images: ["/job/job-icon.png"],
  },
};

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          {/* Breadcrumb + back link */}
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-neutral-600">
            $JOB CORP › HR DIVISION › EMPLOYEE RECORDS
          </p>
          <Link
            href="/"
            className="mb-3 inline-block font-mono text-[10px] uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-400"
          >
            ‹ RETURN TO HOMEPAGE
          </Link>

          {/* Title row — stacks on mobile, side-by-side on sm+ */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Employee Wall
              </h1>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                HR RECORDS — PUBLIC DIRECTORY
              </p>
            </div>
            <Link
              href="/#clock-in"
              className="inline-flex items-center justify-center rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95 sm:shrink-0 sm:py-2.5"
            >
              + SUBMIT YOUR RECORD
            </Link>
          </div>
        </div>

        {/* Grid */}
        <EmployeeGrid />
      </div>
    </main>
  );
}
