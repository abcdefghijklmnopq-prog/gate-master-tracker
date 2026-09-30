import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Page Header */}
            <section className="mb-8">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Dashboard
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back 👋
                </h2>

                <p className="mt-2 max-w-2xl text-slate-600">
                  Track your preparation, complete topics, solve PYQs, and
                  stay consistent with your GATE preparation.
                </p>
              </div>
            </section>

            {/* Statistics */}
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
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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

            {/* Weekly Progress + Countdown */}
            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md lg:col-span-2">
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

            {/* Subject Progress */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Subject Progress
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your preparation across GATE CSE subjects
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                  Overall GATE progress will be enabled as subjects are added
                </div>
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
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
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
                          Coming Soon
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-300"
                          style={{
                            width: "0%",
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Tasks + Recent Activity */}
            <section className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <h3 className="text-lg font-semibold text-slate-900">
                  Today&apos;s Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your daily preparation checklist
                </p>

                <TodayTasks />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
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
      </div>
    </div>
  );
}