"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ACTIVE_SESSION_KEY = "gate-master-tracker-active-study-session";

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
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActiveSession() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const storedSessionId = window.localStorage.getItem(
        ACTIVE_SESSION_KEY,
      );

      if (!storedSessionId) {
        setLoading(false);
        return;
      }

      const parsedSessionId = Number(storedSessionId);

      if (!Number.isInteger(parsedSessionId)) {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
        setLoading(false);
        return;
      }

      const { data, error: sessionError } = await supabase
        .from("study_sessions")
        .select("id, started_at, ended_at")
        .eq("id", parsedSessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      if (!data || data.ended_at) {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
        setLoading(false);
        return;
      }

      const startedAt = new Date(data.started_at).getTime();
      const currentTime = Date.now();
      const seconds = Math.max(
        0,
        Math.floor((currentTime - startedAt) / 1000),
      );

      setSessionId(data.id);
      setElapsedSeconds(seconds);
      setLoading(false);
    }

    loadActiveSession();
  }, []);

  useEffect(() => {
    if (sessionId === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [sessionId]);

  async function startSession() {
    if (saving || sessionId !== null) {
      return;
    }

    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setSaving(false);
      return;
    }

    const startedAt = new Date();

    const { data, error: sessionError } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        started_at: startedAt.toISOString(),
        ended_at: null,
        duration_minutes: 0,
      })
      .select("id")
      .single();

    if (sessionError || !data) {
      setError(
        sessionError?.message ?? "Unable to start study session.",
      );
      setSaving(false);
      return;
    }

    setSessionId(data.id);
    setElapsedSeconds(0);

    window.localStorage.setItem(
      ACTIVE_SESSION_KEY,
      String(data.id),
    );

    setSaving(false);
  }

  async function stopSession() {
    if (saving || sessionId === null) {
      return;
    }

    setSaving(true);
    setError("");

    const endedAt = new Date();
    const durationMinutes = Math.floor(elapsedSeconds / 60);

    const { error: sessionError } = await supabase
      .from("study_sessions")
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", sessionId);

    if (sessionError) {
      setError(sessionError.message);
      setSaving(false);
      return;
    }

    window.localStorage.removeItem(ACTIVE_SESSION_KEY);

    setSessionId(null);
    setElapsedSeconds(0);
    setSaving(false);
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading study timer...
        </p>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Study Timer
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Login to track study time
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your study sessions will be saved to your account.
        </p>

        <a
          href="/login"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Login
        </a>
      </section>
    );
  }

  const isRunning = sessionId !== null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Study Timer
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {isRunning ? "Study session in progress" : "Ready to study?"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isRunning
              ? "Keep studying and stop the timer when you finish."
              : "Start a session to record your study time."}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-6 py-4 text-center">
          <p className="font-mono text-3xl font-bold tracking-tight text-slate-900">
            {formatDuration(elapsedSeconds)}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            {isRunning ? "Current session" : "Not running"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {isRunning ? (
          <button
            type="button"
            onClick={stopSession}
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving session..." : "Stop Study Session"}
          </button>
        ) : (
          <button
            type="button"
            onClick={startSession}
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Starting..." : "Start Study Session"}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isRunning && (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Your session is saved automatically when you stop the timer.
        </p>
      )}
    </section>
  );
}