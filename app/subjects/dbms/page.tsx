import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopicCard from "@/components/subjects/TopicCard";
import type { Topic } from "@/types/topic";

export default async function DBMSPage() {
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, title, description")
    .eq("id", "dbms-chapter-1")
    .single();

  if (chapterError || !chapter) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load DBMS chapter
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {chapterError?.message ?? "Chapter not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select(
      "id, title, description, definition, real_life_example, notes, revision_points, youtube_videos",
    )
    .eq("chapter_id", chapter.id)
    .order("id");

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

  const dbmsTopics: Topic[] = (topics ?? []).map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description ?? "",
    definition: topic.definition ?? "",
    realLifeExample: topic.real_life_example ?? "",
    notes: topic.notes ?? "",
    revisionPoints: Array.isArray(topic.revision_points)
      ? topic.revision_points
      : [],
    completed: false,
    youtubeVideos: Array.isArray(topic.youtube_videos)
      ? topic.youtube_videos
      : [],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  }));

  const completedTopics = dbmsTopics.filter(
    (topic) => topic.completed,
  ).length;

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
        <section>
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
                  {completedTopics}/{dbmsTopics.length}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Topics Completed
                </p>
              </div>
            </div>
          </Link>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {dbmsTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}