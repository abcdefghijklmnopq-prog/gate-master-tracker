import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const mockTests = [
  {
    id: "dbms-core",
    title: "DBMS Core Mock",
    description:
      "Test your understanding of DBMS fundamentals, SQL, normalization, indexing, and transactions.",
    questions: 25,
    marks: 35,
    duration: "45 min",
    difficulty: "Mixed",
    subject: "DBMS",
    status: "Available",
  },
  {
    id: "dbms-sql",
    title: "SQL & Relational Model",
    description:
      "Practice relational algebra, SQL queries, joins, nested queries, and relational concepts.",
    questions: 20,
    marks: 25,
    duration: "35 min",
    difficulty: "Medium",
    subject: "DBMS",
    status: "Available",
  },
  {
    id: "dbms-transactions",
    title: "Transactions & Concurrency",
    description:
      "Practice serializability, locking protocols, deadlocks, recovery, and transaction schedules.",
    questions: 20,
    marks: 25,
    duration: "35 min",
    difficulty: "Medium",
    subject: "DBMS",
    status: "Available",
  },
  {
    id: "full-length-cse",
    title: "GATE CSE Full Length",
    description:
      "A complete GATE-style CSE mock covering the major Computer Science subjects.",
    questions: 65,
    marks: 100,
    duration: "180 min",
    difficulty: "Full Length",
    subject: "CSE",
    status: "Coming Soon",
  },
];

export default function MockTestsPage() {
  const availableTests = mockTests.filter(
    (test) => test.status === "Available",
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                GATE CSE 2027 · Practice Workspace
              </p>

              <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Mock Tests
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Attempt timed tests, track your performance, and
                    identify the topics that need more practice.
                  </p>
                </div>

                <Link
                  href="/pyqs"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Practice PYQs →
                </Link>
              </div>
            </section>

            {/* Summary */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Tests Available
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {availableTests.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Ready for your preparation
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Tests Attempted
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  0
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed attempts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Best Score
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  —
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  No attempts recorded yet
                </p>
              </div>
            </section>

            {/* Available Tests */}
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Test Library
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                  Available Mock Tests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a test based on the topics you want to
                  practice.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {mockTests.map((test) => {
                  const isAvailable = test.status === "Available";

                  return (
                    <article
                      key={test.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                            MT
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-slate-950">
                                {test.title}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                  isAvailable
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {test.status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              {test.subject}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-slate-600">
                        {test.description}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Questions
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.questions}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Marks
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.marks}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.duration}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Level
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.difficulty}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                          {isAvailable
                            ? "Test engine will open next."
                            : "This test will be added later."}
                        </p>

                        <button
                          type="button"
                          disabled={!isAvailable}
                          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            isAvailable
                              ? "bg-slate-950 text-white hover:bg-slate-800"
                              : "cursor-not-allowed bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isAvailable
                            ? "Start Test"
                            : "Coming Soon"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Coming Soon Analytics */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Performance Analytics
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                    Your mock test performance
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Once you start attempting tests, this area will
                    show scores, accuracy, time analysis, and weak
                    topic insights.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      —
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Accuracy
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      —
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Avg. Score
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      —
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Attempts
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}