"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudyPlan() {
  const [targetHours, setTargetHours] = useState(20);
  const [savedTargetHours, setSavedTargetHours] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGoal() {
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

      const { data, error } = await supabase
        .from("study_goals")
        .select("weekly_target_hours")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Failed to load study goal:", error);
      }

      if (data?.weekly_target_hours) {
        setTargetHours(data.weekly_target_hours);
        setSavedTargetHours(data.weekly_target_hours);
      }

      setLoading(false);
    }

    loadGoal();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveGoal = async () => {
    if (!userId || saving) {
      return;
    }

    const normalizedHours = Math.min(
      168,
      Math.max(1, Math.round(targetHours)),
    );

    setTargetHours(normalizedHours);
    setSaving(true);

    const { error } = await supabase
      .from("study_goals")
      .upsert(
        {
          user_id: userId,
          weekly_target_hours: normalizedHours,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

    if (error) {
      console.error("Failed to save study goal:", error);
      setSaving(false);
      return;
    }

    setSavedTargetHours(normalizedHours);
    setSaving(false);
  };

  const hasChanges = targetHours !== savedTargetHours;

  const dailyAverage = (targetHours / 7).toFixed(1);

  const goalPresets = [10, 15, 20, 25, 30];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Weekly Planning
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Study Goal
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set the number of focused study hours you want to complete
            each week.
          </p>
        </div>
      </div>

      {/* Main Goal */}
      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1fr_280px] lg:items-center sm:px-6">
        <div>
          <div className="flex items-end gap-2">
            <div className="text-5xl font-bold tracking-tight text-slate-950">
              {targetHours}
            </div>

            <div className="pb-1 text-sm font-medium text-slate-500">
              hours / week
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            That is approximately{" "}
            <span className="font-semibold text-slate-800">
              {dailyAverage} hours per day
            </span>
            .
          </p>

          {/* Presets */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick targets
            </p>

            <div className="flex flex-wrap gap-2">
              {goalPresets.map((hours) => {
                const active = targetHours === hours;

                return (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setTargetHours(hours)}
                    disabled={!userId || loading}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {hours}h
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goal Input */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label
            htmlFor="weekly-study-goal"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Weekly target
          </label>

          <div className="mt-3 flex items-center gap-3">
            <input
              id="weekly-study-goal"
              type="number"
              min={1}
              max={168}
              value={targetHours}
              onChange={(event) => {
                const value = Number(event.target.value);

                if (Number.isNaN(value)) {
                  return;
                }

                setTargetHours(
                  Math.min(168, Math.max(1, value)),
                );
              }}
              disabled={!userId || loading || saving}
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-lg font-bold text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <span className="text-sm font-medium text-slate-500">
              hrs
            </span>
          </div>

          <button
            type="button"
            onClick={saveGoal}
            disabled={!userId || loading || saving || !hasChanges}
            className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {saving
              ? "Saving..."
              : hasChanges
                ? "Save Weekly Goal"
                : "Goal Saved"}
          </button>

          {!userId && !loading && (
            <p className="mt-3 text-center text-xs font-medium text-amber-600">
              Please log in to manage your study goal.
            </p>
          )}
        </div>
      </div>

      {/* Goal Scale */}
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">
            Weekly commitment
          </span>

          <span className="font-semibold text-slate-800">
            {targetHours} / 168 hours
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-950 transition-all duration-300"
            style={{
              width: `${Math.min((targetHours / 168) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}