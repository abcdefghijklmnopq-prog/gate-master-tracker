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
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            DBMS
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
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Topic
          </p>

          <h1 className="mt-2 text-xl font-bold text-red-800">
            Topic could not be loaded
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {topicError?.message ??
              "The requested DBMS topic could not be found."}
          </p>

          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Chapter
          </Link>
        </div>
      </main>
    );
  }

  const { data: chapterTopics, error: chapterTopicsError } =
    await supabase
      .from("topics")
      .select("id, title")
      .eq("chapter_id", chapter.id)
      .order("id");

  if (chapterTopicsError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Navigation
          </p>

          <h1 className="mt-2 text-xl font-bold text-red-800">
            Topic navigation could not be loaded
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {chapterTopicsError.message}
          </p>

          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
      {/* Top topic header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/subjects"
                className="font-medium text-slate-500 transition hover:text-slate-900"
              >
                Subjects
              </Link>

              <span className="text-slate-300">/</span>

              <Link
                href="/subjects/dbms"
                className="font-medium text-slate-500 transition hover:text-slate-900"
              >
                DBMS
              </Link>

              <span className="text-slate-300">/</span>

              <Link
                href={`/subjects/dbms/${chapterId}`}
                className="font-medium text-slate-500 transition hover:text-slate-900"
              >
                Chapter {chapterNumber}
              </Link>

              <span className="text-slate-300">/</span>

              <span className="font-semibold text-slate-900">
                Topic {topicNumber}
              </span>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                    DBMS
                  </span>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    Chapter {chapterNumber}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    Topic {topicNumber}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {topicData.title}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {topicData.description}
                </p>
              </div>

              <Link
                href={`/subjects/dbms/${chapterId}`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                ← Back to Chapter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {/* Learning progress */}
        <section>
          <TopicProgress topicId={topicData.id} />
        </section>

        {/* Main learning content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            {/* Study Notes */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                    01
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Learn
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Study Notes
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
                  {topicData.notes}
                </div>
              </div>
            </section>

            {/* Definition */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  02
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Core Concept
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Definition
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-5">
                <p className="text-[15px] leading-7 text-slate-700">
                  {topicData.definition}
                </p>
              </div>
            </section>

            {/* Real life example */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  03
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Understanding
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Real-Life Example
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-[15px] leading-7 text-slate-700">
                  {topicData.realLifeExample}
                </p>
              </div>
            </section>

            {/* YouTube lectures */}
            {youtubeVideos.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Watch & Learn
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    YouTube Lectures
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Recommended lectures for understanding this topic.
                  </p>
                </div>

                <div className="space-y-3 p-6">
                  {youtubeVideos.map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {video.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {video.channel}
                          {video.duration
                            ? ` • ${video.duration}`
                            : ""}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-slate-800">
                        Watch
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Revision */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Quick Revision
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Revision Points
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Important points to remember before solving PYQs.
                </p>
              </div>

              <div className="p-6">
                {topicData.revisionPoints.length > 0 ? (
                  <ul className="space-y-3">
                    {topicData.revisionPoints.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900" />

                        <span className="text-sm leading-6 text-slate-700">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      No revision points added yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Learning sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Learning Path
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Learn → Practice → Revise
              </h2>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">
                    01 · Learn
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Read the notes and understand the concept.
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">
                    02 · Practice
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Solve relevant GATE PYQs.
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">
                    03 · Revise
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Review the important revision points.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Topic Navigation
              </p>

              <p className="mt-2 text-sm font-medium text-slate-700">
                Topic {topicNumber} of {topics.length}
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{
                    width:
                      topics.length > 0
                        ? `${((currentTopicIndex + 1) / topics.length) * 100}%`
                        : "0%",
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Keep moving through the chapter.
              </p>
            </section>
          </aside>
        </div>

        {/* Previous / Next */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {previousTopic ? (
            <Link
              href={`/subjects/dbms/${chapterId}/topic-${previousTopic.id
                .split("-")
                .pop()}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Previous Topic
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                ← Continue backwards
              </p>

              <p className="mt-3 font-bold text-slate-900 group-hover:text-slate-700">
                {previousTopic.title}
              </p>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextTopic ? (
            <Link
              href={`/subjects/dbms/${chapterId}/topic-${nextTopic.id
                .split("-")
                .pop()}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:text-right"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Next Topic
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Continue learning →
              </p>

              <p className="mt-3 font-bold text-slate-900 group-hover:text-slate-700">
                {nextTopic.title}
              </p>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </section>

        <div className="mt-6">
          <Link
            href={`/subjects/dbms/${chapterId}`}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            ← Back to Chapter
          </Link>
        </div>
      </div>
    </main>
  );
}