"use client";

import { useState } from "react";

export default function StudyPlan() {
  const [weeklyTarget, setWeeklyTarget] = useState("20");

  function handleTargetChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

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

  const displayedTarget =
    weeklyTarget === "" ? 0 : Number(weeklyTarget);

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
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Set a target between 1 and 168 hours per week.
      </p>
    </section>
  );
}