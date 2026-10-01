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
import PYQStats from "@/components/dashboard/PYQStats";
import MockTestStats from "@/components/dashboard/MockTestStats";
import RecentActivity from "@/components/dashboard/RecentActivity";

const subjects = [
  {
    name: "Database Management System",
    shortName: "DBMS",
    available: true,
  },
  {
    name: "Operating Systems",
    shortName: "OS",
    available: false,
  },
  {
    name: "Computer Networks",
    shortName: "CN",
    available: false,
  },
  {
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    available: false,
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
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-8 lg:p-10">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.04]" />
              <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-slate-500/[0.08]" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    GATE CSE 2027
                  </p>

                  <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                    Your preparation,
                    <br />
                    all in one place.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Track your progress, continue learning, solve PYQs,
                    revise important topics, and stay consistent every day.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/subjects"
                      className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold !text-slate-950 shadow-sm transition hover:bg-slate-100"
                    >
                      Open Subjects
                    </Link>

                    <Link
                      href="/pyqs"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-slate-800"
                    >
                      Practice PYQs
                    </Link>

                    <Link
                      href="/planner"
                      className="rounded-xl border border-slate-700 bg-transparent px-4 py-2.5 text-sm font-semibold !text-slate-300 transition hover:bg-slate-900 hover:!text-white"
                    >
                      Study Planner
                    </Link>
                  </div>
                </div>

                <div className="min-w-[230px] rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Exam Countdown
                  </p>

                  <div className="mt-3 text-2xl font-bold">
                    GATE 2027
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    Keep preparing consistently.
                  </p>

                  <div className="mt-5">
                    <GateCountdown />
                  </div>
                </div>
              </div>
            </section>

            {/* Overview Stats */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Topics Completed
                </p>

                <div className="mt-3">
                  <DashboardProgress
                    topicIds={dbmsTopicIds}
                    mode="topics-completed"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Study Hours
                </p>

                <div className="mt-3">
                  <StudyHours />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Study Streak
                </p>

                <div className="mt-3">
                  <StudyStreak />
                </div>
              </div>

              <Link
                href="/pyqs"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  PYQs Attempted
                </p>

                <div className="mt-3">
                  <PYQStats />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Practice previous year questions →
                </p>
              </Link>

              <Link
                href="/subjects/dbms"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  DBMS Progress
                </p>

                <div className="mt-3">
                  <DashboardProgress
                    topicIds={dbmsTopicIds}
                    mode="dbms-progress"
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Continue learning →
                </p>
              </Link>
            </section>

            {/* Continue Learning + Today's Focus */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <Link
                href="/subjects/dbms"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md lg:col-span-2"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Continue Learning
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      Database Management System
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      Continue your DBMS preparation through chapters,
                      topics, notes, lectures, revision points, and PYQs.
                    </p>
                  </div>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg !text-white transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Chapters
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {dbmsChapterIds.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Topics
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {dbmsTopicIds.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Learning Mode
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      Guided
                    </p>
                  </div>
                </div>
              </Link>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Today&apos;s Focus
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      Study Plan
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Stay on top of your daily preparation tasks.
                    </p>
                  </div>

                  <Link
                    href="/planner"
                    className="text-xs font-semibold !text-slate-600 transition hover:!text-slate-950"
                  >
                    View →
                  </Link>
                </div>

                <div className="mt-4">
                  <TodayTasks />
                </div>
              </div>
            </section>

            {/* Weekly Activity */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Study Activity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    Weekly Study Progress
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your study activity for the current week.
                  </p>
                </div>

                <Link
                  href="/planner"
                  className="text-sm font-semibold !text-slate-600 transition hover:!text-slate-950"
                >
                  Open planner →
                </Link>
              </div>

              <div className="mt-5">
                <WeeklyStudyProgress />
              </div>
            </section>

            {/* Mock Test Performance */}
            <MockTestStats />

            {/* Subject Progress */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Preparation Map
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    Subject Progress
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your preparation across GATE CSE subjects.
                  </p>
                </div>

                <Link
                  href="/subjects"
                  className="text-sm font-semibold !text-slate-600 transition hover:!text-slate-950"
                >
                  View all subjects →
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {subjects.map((subject) =>
                  subject.available ? (
                    <Link
                      key={subject.shortName}
                      href="/subjects/dbms"
                      className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {subject.shortName}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {subject.name}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold !text-emerald-700">
                          Available
                        </span>
                      </div>

                      <div className="mt-5">
                        <DashboardProgress
                          topicIds={dbmsTopicIds}
                          mode="dbms-progress"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={subject.shortName}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {subject.shortName}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {subject.name}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold !text-slate-400">
                          Coming Soon
                        </span>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-0 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}