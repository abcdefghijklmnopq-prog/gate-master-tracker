"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Page Header */}
            <section className="mb-8">
              <p className="text-sm font-medium text-slate-500">
                Workspace
              </p>

              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Study Planner
                  </h1>

                  <p className="mt-2 max-w-2xl text-slate-600">
                    Plan your daily study tasks, weekly targets, revision
                    schedule, and study hours.
                  </p>
                </div>

                <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Planning Workspace
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Stay consistent
                  </p>
                </div>
              </div>
            </section>

            {/* Planner Overview */}
            <section className="grid gap-4 md:grid-cols-3">
              <TodayTasksSummary selectedDate={selectedDate} />

              <WeeklyTargetSummary />

              <StudyStreakSummary />
            </section>

            {/* Calendar */}
            <section className="mt-6">
              <PlannerCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </section>

            {/* Tasks */}
            <section className="mt-6">
              <StudyTasks selectedDate={selectedDate} />
            </section>

            {/* Weekly Study Plan */}
            <section className="mt-6">
              <StudyPlan />
            </section>

            {/* Study Timer */}
            <section className="mt-6">
              <StudyTimer />
            </section>

            {/* Session History */}
            <section className="mt-6">
              <StudySessionHistory />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}