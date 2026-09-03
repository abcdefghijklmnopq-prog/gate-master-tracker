import Link from "next/link";
import { chapterOneTopics } from "@/data/dbms/topics";

export default function DBMSTopicOnePage() {
  const topic = chapterOneTopics.find((item) => item.id === "dbms-1-1");

  if (!topic) {
    return <div>Topic not found.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter 1 / Topic 1
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {topic.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            {topic.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Definition
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              {topic.definition}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Real-Life Example
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              {topic.realLifeExample}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Revision Points
            </h2>

            <ul className="mt-4 space-y-3">
              {topic.revisionPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-base leading-7 text-slate-600"
                >
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-2">
            <Link
              href="/subjects/dbms/chapter-1"
              className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ← Back to Chapter 1
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}