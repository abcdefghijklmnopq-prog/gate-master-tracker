import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const subjects = [
  {
    name: "Database Management Systems",
    shortName: "DBMS",
    description:
      "Relational model, SQL, normalization, indexing, transactions, and concurrency control.",
    href: "/subjects/dbms",
    status: "Available",
    available: true,
  },
  {
    name: "Operating Systems",
    shortName: "OS",
    description:
      "Processes, threads, scheduling, synchronization, memory management, and file systems.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Computer Networks",
    shortName: "CN",
    description:
      "Networking fundamentals, protocols, routing, transport layer, and application layer.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    description:
      "Data structures, algorithms, complexity analysis, graphs, trees, and problem solving.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Theory of Computation",
    shortName: "TOC",
    description:
      "Automata, regular languages, context-free languages, grammars, and computability.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Compiler Design",
    shortName: "CD",
    description:
      "Lexical analysis, parsing, syntax-directed translation, optimization, and code generation.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Computer Organization",
    shortName: "CO",
    description:
      "Computer architecture, instruction sets, memory hierarchy, CPU organization, and I/O.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Digital Logic",
    shortName: "DL",
    description:
      "Boolean algebra, combinational circuits, sequential circuits, and digital systems.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Programming",
    shortName: "Programming",
    description:
      "Programming fundamentals, data representation, recursion, and core programming concepts.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Engineering Mathematics",
    shortName: "Maths",
    description:
      "Discrete mathematics, linear algebra, calculus, probability, and mathematical foundations.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Discrete Mathematics",
    shortName: "DM",
    description:
      "Logic, sets, relations, functions, graphs, combinatorics, and discrete structures.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Software Engineering",
    shortName: "SE",
    description:
      "Software processes, requirements, design, testing, maintenance, and project management.",
    href: "#",
    status: "Coming Soon",
    available: false,
  },
];

export default function SubjectsPage() {
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
                GATE CSE 2027 · Workspace
              </p>

              <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Subjects
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Explore your GATE CSE subjects, track preparation
                    progress, and continue learning topic by topic.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">
                    Subject Library
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {subjects.length} Subjects
                  </p>
                </div>
              </div>
            </section>

            {/* Subject Grid */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => {
                const card = (
                  <div
                    className={`group h-full rounded-2xl border bg-white p-5 shadow-sm transition ${
                      subject.available
                        ? "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                        : "border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                        {subject.shortName}
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                          subject.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {subject.status}
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-bold tracking-tight text-slate-950">
                      {subject.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {subject.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-slate-400">
                        {subject.available
                          ? "Open subject"
                          : "Preparation module"}
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          subject.available
                            ? "text-slate-900 transition group-hover:translate-x-0.5"
                            : "text-slate-300"
                        }`}
                      >
                        {subject.available ? "→" : "Soon"}
                      </span>
                    </div>
                  </div>
                );

                if (!subject.available) {
                  return (
                    <div key={subject.shortName}>
                      {card}
                    </div>
                  );
                }

                return (
                  <Link
                    key={subject.shortName}
                    href={subject.href}
                    className="block h-full"
                  >
                    {card}
                  </Link>
                );
              })}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}