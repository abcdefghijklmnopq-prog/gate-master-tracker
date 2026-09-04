import { supabase } from "@/lib/supabase";
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-800">
            Chapter could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {chapterError?.message ??
              "The requested DBMS chapter could not be found."}
          </p>
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-800">
            Topics could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {topicsError.message}
          </p>
        </div>
      </main>
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
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter 1
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {chapter.title}
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            {chapter.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <ChapterProgress topicIds={topicIds} />

        <section>
          <h2 className="text-xl font-bold text-slate-900">
            Chapter Topics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Study each topic and revise the important points.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {chapterTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}