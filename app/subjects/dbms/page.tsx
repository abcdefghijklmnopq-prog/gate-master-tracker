import Link from "next/link";
import { dbmsChapters } from "@/data/dbms/chapters";
import TopicCard from "@/components/subjects/TopicCard";

export default function DBMSPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-sm font-medium text-slate-500">GATE CSE</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Database Management System
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Study DBMS concepts chapter by chapter and track your topic
            completion.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {dbmsChapters.map((chapter) => (
          <section key={chapter.id}>
            <Link
              href="/subjects/dbms/chapter-1"
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Chapter 1
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {chapter.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {chapter.description}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {chapter.completedTopics}/{chapter.totalTopics}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Topics Completed
                  </p>
                </div>
              </div>
            </Link>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {chapter.topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}