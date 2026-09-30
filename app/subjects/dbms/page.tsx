import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  topicCount: number;
}

export default async function DBMSPage() {
  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, title, description")
    .eq("subject_id", "dbms")
    .order("id");

  if (chaptersError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="min-h-[calc(100vh-5rem)]">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-semibold text-red-800">
                  Unable to load DBMS chapters
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {chaptersError.message}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const chapterList = chapters ?? [];

  const chapterIds = chapterList.map((chapter) => chapter.id);

  const { data: topics, error: topicsError } =
    chapterIds.length > 0
      ? await supabase
          .from("topics")
          .select("id, chapter_id")
          .in("chapter_id", chapterIds)
      : { data: [], error: null };

  if (topicsError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="min-h-[calc(100vh-5rem)]">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-semibold text-red-800">
                  Unable to load DBMS topics
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {topicsError.message}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const topicCounts = new Map<string, number>();

  for (const topic of topics ?? []) {
    topicCounts.set(
      topic.chapter_id,
      (topicCounts.get(topic.chapter_id) ?? 0) + 1,
    );
  }

  const dbmsChapters: Chapter[] = chapterList.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    topicCount: topicCounts.get(chapter.id) ?? 0,
  }));

  const totalTopics = dbmsChapters.reduce(
    (total, chapter) => total + chapter.topicCount,
    0,
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
              <p className="text-sm font-medium text-slate-500">
                GATE CSE · Subject
              </p>

              <div className="mt-1 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Database Management System
                  </h1>

                  <p className="mt-2 max-w-3xl text-slate-600">
                    Study DBMS concepts chapter by chapter and track your
                    topic completion.
                  </p>
                </div>

                <Link
                  href="/pyqs"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Practice DBMS PYQs
                </Link>
              </div>
            </section>

            {/* Subject Overview */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Chapters
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {dbmsChapters.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Complete DBMS structure
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Topics
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {totalTopics}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Topics available to study
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Study Mode
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  Chapter by Chapter
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Learn, practice and revise
                </p>
              </div>
            </section>

            {/* Chapters */}
            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Subject Content
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    DBMS Chapters
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a chapter to view its topics and start studying.
                  </p>
                </div>

                <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">
                  {dbmsChapters.length} Chapters
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {dbmsChapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    href={`/subjects/dbms/chapter-${index + 1}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Chapter {index + 1}
                        </p>

                        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-slate-700">
                          {chapter.title}
                        </h3>
                      </div>

                      <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {chapter.topicCount}
                        </p>

                        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Topics
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">
                      {chapter.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-medium text-slate-500">
                        {chapter.topicCount} topics to study
                      </span>

                      <span className="text-sm font-semibold text-slate-700 transition group-hover:translate-x-0.5">
                        Open chapter →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}