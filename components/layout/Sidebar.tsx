"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AccountSettingsPanel from "@/components/layout/AccountSettingsPanel";

const navigation = [
  {
    label: "Overview",
    href: "/",
    icon: "⌂",
  },
  {
    label: "Subjects",
    href: "/subjects",
    icon: "▣",
  },
  {
    label: "Study Planner",
    href: "/planner",
    icon: "◷",
  },
  {
    label: "PYQs",
    href: "/pyqs",
    icon: "✓",
  },
  {
    label: "Revision",
    href: "/revision",
    icon: "↻",
  },
  {
    label: "Mock Tests",
    href: "/mock-tests",
    icon: "▤",
  },
];

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "!bg-white !text-slate-950 shadow-sm"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition ${
                isActive
                  ? "!bg-slate-100 !text-slate-900"
                  : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white"
              }`}
            >
              {item.icon}
            </span>

            <span
              className={
                isActive
                  ? "!text-slate-950"
                  : "text-inherit"
              }
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-20 items-center border-b border-slate-800 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950 shadow-sm">
              GM
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                GATE Master
              </p>

              <p className="text-xs text-slate-400">
                Tracker
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <NavigationLinks pathname={pathname} />
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between rounded-xl px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300">
                Account
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Preferences & logout
              </p>
            </div>

            <AccountSettingsPanel />
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs font-medium text-slate-300">
              GATE 2027
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Preparation workspace
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
            GM
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">
              GATE Master
            </p>

            <p className="text-[10px] text-slate-400">
              Tracker
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 flex w-[min(85vw,320px)] flex-col bg-slate-950 text-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                  GM
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-wide text-white">
                    GATE Master
                  </p>

                  <p className="text-xs text-slate-400">
                    Tracker
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Workspace
              </p>

              <NavigationLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>

            {/* Mobile Account */}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center justify-between rounded-xl px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-300">
                    Account
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Preferences & logout
                  </p>
                </div>

                <AccountSettingsPanel />
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-xs font-medium text-slate-300">
                  GATE 2027
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Preparation workspace
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}