import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardProgress from "@/components/dashboard/DashboardProgress";

const stats = [
  {
    label: "Study Streak",
    value: "0 Days",
    description: "Start your streak today",
  },
  {
    label: "Study Hours",
    value: "0h",
    description: "This week",
  },
  {
    label: "PYQs Solved",
    value: "0",
    description: "Previous year questions",
  },
];

const subjects = [
  {
    name: "Database Management System",
    shortName: "DBMS",
  },
  {
    name: "Operating Systems",
    shortName: "OS",
    progress: 0,
  },
  {
    name: "Computer Networks",
    shortName: "CN",
    progress: 0,
  },
  {
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    progress: 0,
  },
];

export default async function Home() {
  const { data: dbmsTopics } = await supabase
    .from("topics")
    .select("id")
    .eq("chapter_id", "dbms-chapter-1")
    .order("id");

  const dbmsTopicIds = (dbmsTopics ?? []).map((topic) => topic.id);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              GATE Master Tracker
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your complete GATE CSE preparation dashboard
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            GATE CSE
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <section className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back 👋
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Track your preparation, complete topics, solve PYQs, and stay
            consistent with your GATE preparation.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardProgress
            topicIds={dbmsTopicIds}
            mode="topics-completed"
          />

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Weekly Progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Weekly Study Progress
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your study activity for the current week
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                This Week
              </span>
            </div>

            <div className="mt-8 grid grid-cols-7 gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div key={day} className="text-center">
                    <div className="flex h-40 items-end justify-center">
                      <div className="h-2 w-full max-w-8 rounded-t-md bg-slate-200" />
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-500">
                      {day}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* GATE Countdown */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              GATE Countdown
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Preparation Mode
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Your countdown and exam schedule will be connected here.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["--", "Days"],
                ["--", "Hours"],
                ["--", "Minutes"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/10 p-3 text-center"
                >
                  <p className="text-xl font-bold">{value}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Subject Progress
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track your preparation across GATE CSE subjects
              </p>
            </div>

            <span className="text-sm font-medium text-slate-500">
              0% Overall
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {subjects.map((subject) =>
              subject.shortName === "DBMS" ? (
                <div key={subject.shortName}>
                  <DashboardProgress
                    topicIds={dbmsTopicIds}
                    mode="dbms-progress"
                  />
                </div>
              ) : (
                <div
                  key={subject.shortName}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {subject.shortName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {subject.name}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-slate-600">
                      {subject.progress}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{
                        width: `${subject.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Today's Tasks */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Today&apos;s Tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your daily preparation checklist
            </p>

            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-700">
                No tasks yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your daily tasks will appear here.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your latest preparation activity
            </p>

            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-700">
                No activity yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed topics and solved questions will appear here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}