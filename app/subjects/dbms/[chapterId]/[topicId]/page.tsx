import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopicProgress from "@/components/subjects/TopicProgress";

interface TopicPageProps {
  params: Promise<{
    chapterId: string;
    topicId: string;
  }>;
}

export default async function DBMSTopicPage({
  params,
}: TopicPageProps) {
  const { chapterId, topicId } = await params;

  const dbmsChapterId = `dbms-${chapterId}`;
  const dbmsTopicId = `dbms-${chapterId.replace("chapter-", "")}-${topicId.replace(
    "topic-",
    "",
  )}`;

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

  const chapterNumber = chapter.id.split("-").pop();
  const topicNumber = topic.id.split("-").pop();

  const youtubeVideos = Array.isArray(topic.youtube_videos)
    ? topic.youtube_videos
    : [];

  const revisionPoints = Array.isArray(topic.revision_points)
    ? topic.revision_points
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter {chapterNumber} / Topic {topicNumber}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {topic.title}
          </h1>

          <p className="mt-2 text-slate-600">
            {topic.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Chapter
          </Link>
        </div>

        <TopicProgress topicId={topic.id} />

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Definition
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {topic.definition}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Real-Life Example
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {topic.real_life_example}
            </p>
          </section>

          {topic.notes && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Notes
              </h2>

              <div className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {topic.notes}
              </div>
            </section>
          )}

          {youtubeVideos.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Recommended Videos
              </h2>

              <div className="mt-4 space-y-3">
                {youtubeVideos.map(
                  (
                    video: {
                      id: string;
                      title: string;
                      url: string;
                      channel: string;
                      duration?: string;
                    },
                    index: number,
                  ) => (
                    <a
                      key={video.id ?? index}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <p className="font-semibold text-slate-900">
                        {video.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {video.channel}
                        {video.duration
                          ? ` • ${video.duration}`
                          : ""}
                      </p>
                    </a>
                  ),
                )}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Revision Points
            </h2>

            <ul className="mt-4 space-y-3">
              {revisionPoints.map((point, index) => (
                <li
                  key={`${point}-${index}`}
                  className="flex gap-3 leading-7 text-slate-600"
                >
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}