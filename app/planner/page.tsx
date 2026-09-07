"use client";

import { useState } from "react";
import Link from "next/link";
import PlannerCalendar from "@/components/planner/PlannerCalendar";
import StudyPlan from "@/components/planner/StudyPlan";
import StudySessionHistory from "@/components/planner/StudySessionHistory";
import StudyStreakSummary from "@/components/planner/StudyStreakSummary";
import StudyTasks from "@/components/planner/StudyTasks";
import StudyTimer from "@/components/planner/StudyTimer";
import TodayTasksSummary from "@/components/planner/TodayTasksSummary";
import WeeklyTargetSummary from "@/components/planner/WeeklyTargetSummary";

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                GATE Master Tracker
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Study Planner
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Plan your daily study tasks, weekly targets, revision schedule,
                and study hours.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <TodayTasksSummary />

            <WeeklyTargetSummary />

            <StudyStreakSummary />
          </div>

          <div className="mt-8">
            <PlannerCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          <div className="mt-8">
            <StudyTasks />
          </div>

          <div className="mt-8">
            <StudyPlan />
          </div>

          <div className="mt-8">
            <StudyTimer />
          </div>

          <div className="mt-8">
            <StudySessionHistory />
          </div>
        </div>
      </div>
    </main>
  );
}