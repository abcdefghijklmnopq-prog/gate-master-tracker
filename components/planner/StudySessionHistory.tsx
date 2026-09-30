"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StudySession = {
  id: number;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
};

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatSessionDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSessionTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudySessionHistory() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setUserId(null);
        setSessions([]);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("study_sessions")
        .select(
          "id, started_at, ended_at, duration_minutes",
        )
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(20);

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "Failed to load study session history:",
          error,
        );
        setSessions([]);
      } else {
        setSessions((data ?? []) as StudySession[]);
      }

      setLoading(false);
    }

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedSessions = sessions.filter(
    (session) => session.ended_at !== null,
  );

  const totalMinutes = completedSessions.reduce(
    (total, session) => total + session.duration_minutes,
    0,
  );

  const averageMinutes =
    completedSessions.length > 0
      ? Math.round(totalMinutes / completedSessions.length)
      : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Focus Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Study Session History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your recent focused study sessions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Recent sessions
            </p>

            <p className="mt-0.5 text-sm font-bold text-slate-900">
              {completedSessions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 border-b border-slate-100 sm:grid-cols-3">
        <div className="border-r border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-medium text-slate-500">
            Total Focus
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            {formatDuration(totalMinutes)}
          </p>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:border-r sm:border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            Average Session
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            {formatDuration(averageMinutes)}
          </p>
        </div>

        <div className="col-span-2 border-t border-slate-100 px-5 py-5 sm:col-span-1 sm:border-t-0 sm:px-6">
          <p className="text-xs font-medium text-slate-500">
            Sessions Tracked
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            {completedSessions.length}
          </p>
        </div>
      </div>

      {/* Session List */}
      <div className="px-5 py-5 sm:px-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : !userId ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
              ◷
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              Sign in to track your sessions
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Your completed study sessions will appear here.
            </p>
          </div>
        ) : completedSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
              ◷
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              No completed sessions yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Start a focus session above and your study history
              will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                  {session.duration_minutes >= 60
                    ? "H"
                    : "F"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Focus Study Session
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span>
                      {formatSessionDate(session.started_at)}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span>
                      {formatSessionTime(session.started_at)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-950">
                    {formatDuration(session.duration_minutes)}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {completedSessions.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <p className="text-xs text-slate-500">
            Showing your{" "}
            <span className="font-semibold text-slate-700">
              20 most recent
            </span>{" "}
            recorded study sessions.
          </p>
        </div>
      )}
    </section>
  );
}