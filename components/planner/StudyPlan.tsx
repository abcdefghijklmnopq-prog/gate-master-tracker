"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudyPlan() {
  const [weeklyTarget, setWeeklyTarget] = useState("20");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudyGoal() {
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

      const { data, error: goalError } = await supabase
        .from("study_goals")
        .select("weekly_target_hours")
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalError) {
        setError(goalError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setWeeklyTarget(String(data.weekly_target_hours));
      }

      setLoading(false);
    }

    loadStudyGoal();
  }, []);

  function handleTargetChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setSaved(false);
    setError("");

    if (value === "") {
      setWeeklyTarget("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const numericValue = Number(value);

    if (numericValue > 168) {
      setWeeklyTarget("168");
      return;
    }

    setWeeklyTarget(value);
  }

  function handleTargetBlur() {
    if (weeklyTarget === "") {
      setWeeklyTarget("1");
      return;
    }

    const numericValue = Number(weeklyTarget);

    if (numericValue < 1) {
      setWeeklyTarget("1");
    }
  }

  async function saveStudyGoal() {
    if (saving) {
      return;
    }

    const numericTarget = Number(weeklyTarget);

    if (
      !Number.isInteger(numericTarget) ||
      numericTarget < 1 ||
      numericTarget > 168
    ) {
      setError("Weekly target must be between 1 and 168 hours.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("study_goals")
      .upsert(
        {
          user_id: user.id,
          weekly_target_hours: numericTarget,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setWeeklyTarget(String(numericTarget));
    setSaved(true);
    setSaving(false);
  }

  const displayedTarget =
    weeklyTarget === "" ? 0 : Number(weeklyTarget);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading weekly target...
        </p>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Weekly Study Target
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Login to save your weekly goal
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your weekly study target will be saved to your account.
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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Weekly Study Target
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Set your weekly goal
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Choose how many hours you want to study each week.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="text-sm font-medium text-slate-700">
            Target hours
          </span>

          <input
            type="number"
            min="1"
            max="168"
            step="1"
            value={weeklyTarget}
            onChange={handleTargetChange}
            onBlur={handleTargetBlur}
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </label>

        <div className="rounded-xl bg-slate-100 px-5 py-3 sm:min-w-32">
          <p className="text-xs font-medium text-slate-500">
            Weekly Goal
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {displayedTarget} hrs
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={saveStudyGoal}
        disabled={saving}
        className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : saved ? "Target Saved" : "Save Weekly Target"}
      </button>

      {saved && (
        <p className="mt-3 text-sm font-medium text-emerald-600">
          Weekly target saved successfully.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Set a target between 1 and 168 hours per week.
      </p>
    </section>
  );
}