"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem(
    "gate-master-tracker-theme",
  ) === "dark"
    ? "dark"
    : "light";
}

export default function AccountSettingsPanel() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
      setLoadingUser(false);
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.localStorage.setItem(
      "gate-master-tracker-theme",
      theme,
    );
  }, [theme]);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open account and settings"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        {email ? email.charAt(0).toUpperCase() : "A"}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close settings"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px]"
          />

          <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  GATE Master Tracker
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Account & Settings
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close account and settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-lg font-medium text-slate-600 transition hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <section>
                <p className="text-sm font-semibold text-slate-900">
                  Account
                </p>

                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {loadingUser ? (
                    <p className="text-sm text-slate-500">
                      Loading account...
                    </p>
                  ) : email ? (
                    <>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Signed in as
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                        {email}
                      </p>

                      <p className="mt-1 text-xs text-emerald-600">
                        Account active
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900">
                        You are not logged in
                      </p>

                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="mt-3 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </section>

              <section className="mt-8">
                <p className="text-sm font-semibold text-slate-900">
                  Appearance
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how GATE Master Tracker looks.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => changeTheme("light")}
                    className={`rounded-xl border p-4 text-left transition ${
                      theme === "light"
                        ? "border-slate-900 bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg">☀️</span>

                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      Light
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Light appearance
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeTheme("dark")}
                    className={`rounded-xl border p-4 text-left transition ${
                      theme === "dark"
                        ? "border-slate-900 bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg">🌙</span>

                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      Dark
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Dark appearance
                    </p>
                  </button>
                </div>
              </section>

              <section className="mt-8">
                <p className="text-sm font-semibold text-slate-900">
                  Settings
                </p>

                <div className="mt-3 rounded-xl border border-slate-200 bg-white">
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        General Settings
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage your application preferences
                      </p>
                    </div>

                    <span className="text-slate-400">
                      →
                    </span>
                  </Link>
                </div>
              </section>
            </div>

            <div className="border-t border-slate-200 p-6">
              {email ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Login
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}