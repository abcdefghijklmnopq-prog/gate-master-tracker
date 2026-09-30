import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AccountSettingsPanel from "@/components/layout/AccountSettingsPanel";
import DashboardProgress from "@/components/dashboard/DashboardProgress";
import GateCountdown from "@/components/dashboard/GateCountdown";
import StudyHours from "@/components/dashboard/StudyHours";
import StudyStreak from "@/components/dashboard/StudyStreak";
import TodayTasks from "@/components/dashboard/TodayTasks";
import WeeklyStudyProgress from "@/components/dashboard/WeeklyStudyProgress";

const stats = [
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
  const { data: dbmsChapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("subject_id", "dbms")
    .order("id");

  const dbmsChapterIds = (dbmsChapters ?? []).map(
    (chapter) => chapter.id,
  );

  const { data: dbmsTopics } =
    dbmsChapterIds.length > 0
      ? await supabase
          .from("topics")
          .select("id")
          .in("chapter_id", dbmsChapterIds)
          .order("id")
      : { data: [] };

  const dbmsTopicIds = (dbmsTopics ?? []).map(
    (topic) => topic.id,
  );

  return (
    <main className="min-h-screen bg-slate-50">
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

          <div className="flex items-center gap-3">
            <Link
              href="/planner"
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Study Planner
            </Link>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              GATE CSE
            </div>

            <AccountSettingsPanel />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardProgress
            topicIds={dbmsTopicIds}
            mode="topics-completed"
          />

          <StudyHours />

          <StudyStreak />

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

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
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

            <WeeklyStudyProgress />
          </div>

          <GateCountdown />
        </section>

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

            <DashboardProgress
              topicIds={dbmsTopicIds}
              mode="overall-progress"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {subjects.map((subject) =>
              subject.shortName === "DBMS" ? (
                <Link
                  key={subject.shortName}
                  href="/subjects/dbms"
                  className="block rounded-xl transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <DashboardProgress
                    topicIds={dbmsTopicIds}
                    mode="dbms-progress"
                  />
                </Link>
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

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Today&apos;s Tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your daily preparation checklist
            </p>

            <TodayTasks />
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