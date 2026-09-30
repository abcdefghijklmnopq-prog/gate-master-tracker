import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TopicCard from "@/components/subjects/TopicCard";
import ChapterProgress from "@/components/subjects/ChapterProgress";
import type { Topic } from "@/types/topic";

export default async function DBMSChapterOnePage() {
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, title, description")
    .eq("id", "dbms-chapter-1")
    .single();

  if (chapterError || !chapter) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="min-h-[calc(100vh-5rem)]">
            <div className="mx-auto flex max-w-7xl items-center px-6 py-8 lg:px-8">
              <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-8">
                <p className="text-sm font-medium text-red-600">
                  DBMS · Chapter 1
                </p>

                <h1 className="mt-2 text-xl font-bold text-red-800">
                  Chapter could not be loaded
                </h1>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {chapterError?.message ??
                    "The requested DBMS chapter could not be found."}
                </p>

                <Link
                  href="/subjects/dbms"
                  className="mt-5 inline-flex rounded-xl bg-red-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-900"
                >
                  ← Back to DBMS
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
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
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="min-h-[calc(100vh-5rem)]">
            <div className="mx-auto flex max-w-7xl items-center px-6 py-8 lg:px-8">
              <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-8">
                <p className="text-sm font-medium text-red-600">
                  DBMS · Chapter 1
                </p>

                <h1 className="mt-2 text-xl font-bold text-red-800">
                  Topics could not be loaded
                </h1>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {topicsError.message}
                </p>

                <Link
                  href="/subjects/dbms"
                  className="mt-5 inline-flex rounded-xl bg-red-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-900"
                >
                  ← Back to DBMS
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const chapterTopics: Topic[] = (topics ?? []).map((topic) => ({
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

  const topicIds = chapterTopics.map((topic) => topic.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/subjects/dbms"
                className="font-medium text-slate-500 transition hover:text-slate-900"
              >
                DBMS
              </Link>

              <span className="text-slate-300">/</span>

              <span className="font-medium text-slate-700">
                Chapter 1
              </span>
            </div>

            {/* Chapter Header */}
            <section className="mb-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    DBMS · Chapter 1
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {chapter.title}
                  </h1>

                  <p className="mt-3 max-w-3xl text-slate-600">
                    {chapter.description}
                  </p>
                </div>

                <Link
                  href="/subjects/dbms"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  ← Back to DBMS
                </Link>
              </div>
            </section>

            {/* Chapter Overview */}
            <section className="mb-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Chapter Topics
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {chapterTopics.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Topics available in this chapter
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Learning Path
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  Learn → Practice → Revise
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Follow each topic step by step
                </p>
              </div>
            </section>

            {/* Chapter Progress */}
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-sm font-medium text-slate-500">
                  Chapter Progress
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  Your learning progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete notes, videos, revision and PYQs for each topic.
                </p>
              </div>

              <ChapterProgress topicIds={topicIds} />
            </section>

            {/* Topics */}
            <section>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Chapter Content
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Chapter Topics
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Study each topic and revise the important points.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {chapterTopics.length} Topics
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {chapterTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="transition duration-200 hover:-translate-y-0.5"
                  >
                    <TopicCard
                      topic={topic}
                      chapterNumber={1}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}