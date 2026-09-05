import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
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

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-sm font-medium text-slate-500">
            GATE CSE
          </p>

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
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              DBMS Chapters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a chapter to view its topics and start studying.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {dbmsChapters.map((chapter, index) => (
              <Link
                key={chapter.id}
                href={`/subjects/dbms/chapter-${index + 1}`}
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Chapter {index + 1}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {chapter.topicCount}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Topics
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {chapter.description}
                </p>

                <div className="mt-5 text-sm font-medium text-slate-500">
                  Open chapter →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}