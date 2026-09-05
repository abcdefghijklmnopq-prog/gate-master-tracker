import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopicProgress from "@/components/subjects/TopicProgress";
import type { Topic } from "@/types/topic";

interface TopicPageProps {
  params: Promise<{
    chapterId: string;
    topicId: string;
  }>;
}

interface ChapterTopic {
  id: string;
  title: string;
}

export default async function DBMSTopicPage({
  params,
}: TopicPageProps) {
  const { chapterId, topicId } = await params;

  const dbmsChapterId = `dbms-${chapterId}`;

  const chapterNumber = chapterId.replace("chapter-", "");
  const topicNumber = topicId.replace("topic-", "");

  const dbmsTopicId = `dbms-${chapterNumber}-${topicNumber}`;

  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, title")
    .eq("id", dbmsChapterId)
    .eq("subject_id", "dbms")
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

          <Link
            href="/subjects/dbms"
            className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to DBMS
          </Link>
        </div>
      </main>
    );
  }

  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select(
      "id, title, description, definition, real_life_example, notes, revision_points, youtube_videos",
    )
    .eq("id", dbmsTopicId)
    .eq("chapter_id", chapter.id)
    .single();

  if (topicError || !topic) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-800">
            Topic could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {topicError?.message ??
              "The requested DBMS topic could not be found."}
          </p>

          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Chapter
          </Link>
        </div>
      </main>
    );
  }

  const { data: chapterTopics, error: chapterTopicsError } = await supabase
    .from("topics")
    .select("id, title")
    .eq("chapter_id", chapter.id)
    .order("id");

  if (chapterTopicsError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-800">
            Topic navigation could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {chapterTopicsError.message}
          </p>

          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Chapter
          </Link>
        </div>
      </main>
    );
  }

  const topics = (chapterTopics ?? []) as ChapterTopic[];

  const currentTopicIndex = topics.findIndex(
    (chapterTopic) => chapterTopic.id === topic.id,
  );

  const previousTopic =
    currentTopicIndex > 0
      ? topics[currentTopicIndex - 1]
      : null;

  const nextTopic =
    currentTopicIndex >= 0 &&
    currentTopicIndex < topics.length - 1
      ? topics[currentTopicIndex + 1]
      : null;

  const topicData: Topic = {
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
  };

  const youtubeVideos = topicData.youtubeVideos ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter {chapterNumber} / Topic {topicNumber}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {topicData.title}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            {topicData.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Chapter
          </Link>
        </div>

        <TopicProgress topicId={topicData.id} />

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Study Notes
          </h2>

          <div className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-700">
            {topicData.notes}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Definition
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topicData.definition}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Real-Life Example
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topicData.realLifeExample}
          </p>
        </section>

        {youtubeVideos.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              YouTube Lectures
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Recommended lecture searches for this topic.
            </p>

            <div className="mt-5 space-y-3">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {video.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {video.channel}
                        {video.duration
                          ? ` • ${video.duration}`
                          : ""}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                      Watch
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Revision Points
          </h2>

          <ul className="mt-5 space-y-3">
            {topicData.revisionPoints.map((point) => (
              <li
                key={point}
                className="flex gap-3 leading-7 text-slate-700"
              >
                <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {previousTopic ? (
            <Link
              href={`/subjects/dbms/${chapterId}/topic-${previousTopic.id
                .split("-")
                .pop()}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="text-sm font-medium text-slate-500">
                ← Previous Topic
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {previousTopic.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextTopic ? (
            <Link
              href={`/subjects/dbms/${chapterId}/topic-${nextTopic.id
                .split("-")
                .pop()}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-right transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="text-sm font-medium text-slate-500">
                Next Topic →
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {nextTopic.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-6">
          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Chapter
          </Link>
        </div>
      </div>
    </main>
  );
}