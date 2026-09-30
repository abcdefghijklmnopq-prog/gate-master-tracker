"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
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
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            pathname.startsWith("/settings")
              ? "!bg-white !text-slate-950"
              : "text-slate-400 hover:bg-slate-900 hover:text-white"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
              pathname.startsWith("/settings")
                ? "!bg-slate-100 !text-slate-900"
                : "bg-slate-900"
            }`}
          >
            ⚙
          </span>

          <span
            className={
              pathname.startsWith("/settings")
                ? "!text-slate-950"
                : "text-inherit"
            }
          >
            Settings
          </span>
        </Link>

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
  );
}