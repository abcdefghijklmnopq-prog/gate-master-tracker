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
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Page Header */}
            <section className="mb-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Workspace · Planning
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Study Planner
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Plan your study days, manage tasks, track your weekly
                    target, and record focused study sessions.
                  </p>
                </div>

                <Link
                  href="/"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  ← Dashboard
                </Link>
              </div>
            </section>

            {/* Summary Cards */}
            <section className="grid gap-4 md:grid-cols-3">
              <TodayTasksSummary selectedDate={selectedDate} />

              <WeeklyTargetSummary />

              <StudyStreakSummary />
            </section>

            {/* Calendar */}
            <section className="mt-8">
              <PlannerCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </section>

            {/* Tasks */}
            <section className="mt-8">
              <StudyTasks selectedDate={selectedDate} />
            </section>

            {/* Study Plan */}
            <section className="mt-8">
              <StudyPlan />
            </section>

            {/* Study Timer */}
            <section className="mt-8">
              <StudyTimer />
            </section>

            {/* Session History */}
            <section className="mt-8">
              <StudySessionHistory />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}