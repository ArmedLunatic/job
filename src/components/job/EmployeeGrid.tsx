"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";
import Modal from "@/components/ui/Modal";
import type { EmployeeRow, Role, Stamp } from "@/lib/job/types";

const ROLES: { value: "" | Role; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "engineer", label: "Engineer" },
  { value: "designer", label: "Designer" },
  { value: "product", label: "Product" },
  { value: "operations", label: "Operations" },
  { value: "marketing", label: "Marketing" },
  { value: "leadership", label: "Leadership" },
  { value: "other", label: "Other" },
];

const STAMP_LABEL: Record<Stamp, string> = {
  none: "",
  star: "⭐ ALL STAR",
  rocket: "🚀 HIRED",
  crown: "👑 LEGEND",
  lightning: "⚡ NIGHT SHIFT",
  heart: "❤️ UNFIREABLE",
};

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function EmployeeGrid() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"" | Role>("");
  const [selected, setSelected] = useState<EmployeeRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const sb = getClient();
      const { data, error } = await sb
        .from("employees")
        .select("*")
        .eq("consent", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setEmployees((data as EmployeeRow[]) ?? []);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : "Could not load employees."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = employees.filter((e) => {
    const matchSearch = search
      ? e.username.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchRole = filterRole ? e.role === filterRole : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Controls toolbar */}
      <div className="rounded border border-neutral-800 bg-neutral-900/50">
        <div className="border-b border-neutral-800 px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
            DIRECTORY CONTROLS
          </span>
        </div>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY NAME…"
            aria-label="Search employees by username"
            className="flex-1 rounded border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white placeholder:text-neutral-700 outline-none focus:border-neutral-600"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as "" | Role)}
            aria-label="Filter by role"
            className="rounded border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-600 sm:w-48"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={load}
            className="rounded border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-white"
          >
            ↻ REFRESH RECORDS
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex h-40 items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-600">
          LOADING RECORDS…
        </div>
      )}

      {!loading && loadError && (
        <div className="rounded border border-red-800/40 bg-red-950/20 p-6 text-center">
          <p className="text-sm text-red-400">{loadError}</p>
          <p className="mt-2 text-xs text-neutral-600">
            Make sure Supabase env vars are configured.
          </p>
        </div>
      )}

      {!loading && !loadError && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded border border-dashed border-neutral-800 py-16 text-center">
          <span className="text-4xl">👔</span>
          <p className="text-sm font-medium text-neutral-400">No employees yet</p>
          <p className="text-xs text-neutral-600">
            {employees.length > 0
              ? "No results match your search."
              : "Be the first to clock in and publish your badge."}
          </p>
          <Link
            href="/#clock-in"
            className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Clock In Now →
          </Link>
        </div>
      )}

      {!loading && !loadError && visible.length > 0 && (
        <>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">
            RECORDS FOUND: {visible.length}
            {employees.length > visible.length &&
              ` OF ${employees.length} SHOWN`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((emp) => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onClick={() => setSelected(emp)}
              />
            ))}
          </div>
        </>
      )}

      {/* Detail modal */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `EMPLOYEE RECORD — @${selected.username}` : undefined}
      >
        {selected && <EmployeeDetail emp={selected} />}
      </Modal>
    </div>
  );
}

function EmployeeCard({
  emp,
  onClick,
}: {
  emp: EmployeeRow;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded border border-neutral-800 bg-neutral-900/50 p-4 text-center transition-all hover:border-neutral-600 hover:bg-neutral-900"
    >
      {/* Badge PFP */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-700 group-hover:border-blue-500 transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={emp.badge_url}
          alt={`@${emp.username} badge`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-0.5">
        <p className="font-mono text-sm font-semibold text-white">@{emp.username}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          DEPT: {emp.role}
        </p>
        {emp.stamp !== "none" && (
          <p className="text-xs text-blue-400">{STAMP_LABEL[emp.stamp as Stamp]}</p>
        )}
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-700">
          FILED: {timeSince(emp.created_at)}
        </p>
      </div>
    </button>
  );
}

function EmployeeDetail({ emp }: { emp: EmployeeRow }) {
  function download(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.click();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-neutral-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={emp.badge_url}
            alt={`@${emp.username}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-mono text-base font-semibold text-white">
            @{emp.username}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            DEPT: {emp.role}
          </p>
          {emp.stamp !== "none" && (
            <p className="text-xs text-blue-400">
              {STAMP_LABEL[emp.stamp as Stamp]}
            </p>
          )}
        </div>
      </div>

      {/* Job Alert Card */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          DOCUMENT: JOB ALERT CARD
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={emp.job_card_url}
          alt="Job Alert Card"
          className="w-full rounded border border-neutral-800"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => download(emp.job_card_url, `${emp.username}-job-alert.png`)}
            className="flex-1 rounded border border-neutral-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-white"
          >
            ↓ DOWNLOAD CARD
          </button>
          <button
            type="button"
            onClick={() => download(emp.badge_url, `${emp.username}-badge.png`)}
            className="flex-1 rounded border border-neutral-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-white"
          >
            ↓ DOWNLOAD BADGE
          </button>
        </div>
      </div>
    </div>
  );
}
