"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Left */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            GATE CSE 2027
          </p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Preparation Dashboard
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/pyqs"
            className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
          >
            Practice PYQs
          </Link>

          <Link
            href="/planner"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Study Planner
          </Link>

          <Link
            href="/settings"
            aria-label="Open settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            ⚙
          </Link>
        </div>
      </div>
    </header>
  );
}