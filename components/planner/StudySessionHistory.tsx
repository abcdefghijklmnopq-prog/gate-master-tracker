"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudySession {
  id: number;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export default function StudySessionHistory() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudySessions() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_sessions")
        .select(
          "id, started_at, ended_at, duration_minutes",
        )
        .eq("user_id", user.id)
        .not("ended_at", "is", null)
        .order("started_at", {
          ascending: false,
        })
        .limit(10);

      if (error) {
        setSessions([]);
        setLoading(false);
        return;
      }

      setSessions((data ?? []) as StudySession[]);
      setLoading(false);
    }

    loadStudySessions();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Study History
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Recent Study Sessions
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your latest completed study sessions.
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              Loading study history...
            </p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="font-medium text-slate-700">
              No study sessions yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed study sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {formatDate(session.started_at)}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatTime(session.started_at)}
                    {session.ended_at
                      ? ` – ${formatTime(session.ended_at)}`
                      : ""}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {formatDuration(session.duration_minutes)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}