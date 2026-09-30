"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const ACTIVE_SESSION_KEY = "gate-master-active-study-session";

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function StudyTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = Boolean(startedAt && sessionId);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const storedSessionId = window.localStorage.getItem(
        ACTIVE_SESSION_KEY,
      );

      if (!storedSessionId) {
        setLoading(false);
        return;
      }

      const parsedSessionId = Number(storedSessionId);

      if (!Number.isFinite(parsedSessionId)) {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_sessions")
        .select("id, started_at, ended_at")
        .eq("id", parsedSessionId)
        .eq("user_id", user.id)
        .is("ended_at", null)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error || !data) {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
        setLoading(false);
        return;
      }

      setSessionId(data.id);
      setStartedAt(data.started_at);

      const startedTime = new Date(data.started_at).getTime();
      const currentTime = Date.now();

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor((currentTime - startedTime) / 1000),
        ),
      );

      setLoading(false);
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isRunning || !startedAt) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return;
    }

    const updateElapsed = () => {
      const startedTime = new Date(startedAt).getTime();
      const currentTime = Date.now();

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor((currentTime - startedTime) / 1000),
        ),
      );
    };

    updateElapsed();

    timerRef.current = setInterval(updateElapsed, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, startedAt]);

  const startTimer = async () => {
    if (!userId || actionLoading || isRunning) {
      return;
    }

    setActionLoading(true);

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("study_sessions")
      .insert({
        user_id: userId,
        started_at: now,
        duration_minutes: 0,
      })
      .select("id, started_at")
      .single();

    if (error || !data) {
      console.error("Failed to start study session:", error);
      setActionLoading(false);
      return;
    }

    window.localStorage.setItem(
      ACTIVE_SESSION_KEY,
      String(data.id),
    );

    setSessionId(data.id);
    setStartedAt(data.started_at);
    setElapsedSeconds(0);
    setActionLoading(false);
  };

  const stopTimer = async () => {
    if (!userId || !sessionId || !startedAt || actionLoading) {
      return;
    }

    setActionLoading(true);

    const endedAt = new Date();
    const startedTime = new Date(startedAt).getTime();

    const durationSeconds = Math.max(
      0,
      Math.floor((endedAt.getTime() - startedTime) / 1000),
    );

    const durationMinutes = Math.floor(durationSeconds / 60);

    const { error } = await supabase
      .from("study_sessions")
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to stop study session:", error);
      setActionLoading(false);
      return;
    }

    window.localStorage.removeItem(ACTIVE_SESSION_KEY);

    setSessionId(null);
    setStartedAt(null);
    setElapsedSeconds(0);
    setActionLoading(false);
  };

  const progressSeconds = elapsedSeconds % 3600;
  const progressPercent = Math.min(
    (progressSeconds / 3600) * 100,
    100,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Focus Session
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Study Timer
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track focused study time automatically in your study history.
          </p>
        </div>
      </div>

      {/* Timer Area */}
      <div className="grid gap-6 px-5 py-7 lg:grid-cols-[1fr_280px] lg:items-center sm:px-6">
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 px-6 py-8 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-white/5" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <span
                  className={`h-3 w-3 rounded-full ${
                    isRunning
                      ? "animate-pulse bg-white"
                      : "bg-slate-500"
                  }`}
                />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {isRunning ? "Focus session active" : "Ready to focus"}
              </p>

              <div className="mt-3 font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {formatDuration(elapsedSeconds)}
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {isRunning
                  ? "Keep going. Your session is being recorded."
                  : "Start the timer when you begin studying."}
              </p>
            </div>
          </div>

          {/* Session Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Current hour
              </span>

              <span className="font-semibold text-slate-800">
                {Math.floor(progressSeconds / 60)} min
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-950 transition-all duration-1000"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Session Controls
          </p>

          <div className="mt-4 space-y-3">
            {!isRunning ? (
              <button
                type="button"
                onClick={startTimer}
                disabled={!userId || loading || actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <span className="text-base">▶</span>
                {actionLoading ? "Starting..." : "Start Session"}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopTimer}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <span className="text-base">■</span>
                {actionLoading ? "Saving..." : "Stop Session"}
              </button>
            )}

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">
                Session status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isRunning ? "animate-pulse bg-slate-950" : "bg-slate-300"
                  }`}
                />

                <span className="text-sm font-semibold text-slate-800">
                  {loading
                    ? "Loading..."
                    : isRunning
                      ? "Recording"
                      : "Not active"}
                </span>
              </div>
            </div>
          </div>

          {!userId && !loading && (
            <p className="mt-4 text-center text-xs font-medium text-amber-600">
              Please log in to track study sessions.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Study sessions are automatically saved to your history.
          </span>

          {isRunning && startedAt && (
            <span className="font-medium text-slate-700">
              Started{" "}
              {new Date(startedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}