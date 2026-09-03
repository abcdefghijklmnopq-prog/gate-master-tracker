import Link from "next/link";
import { notFound } from "next/navigation";
import { chapterOneTopics } from "@/data/dbms/topics";

interface TopicPageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function DBMSTopicPage({
  params,
}: TopicPageProps) {
  const { topicId } = await params;

  const topicNumber = topicId.replace("topic-", "");

  const topic = chapterOneTopics.find(
    (item) => item.id === `dbms-1-${topicNumber}`,
  );

  if (!topic) {
    notFound();
  }

  const progress = topic.progress;

  const progressItems = [
    {
      label: "Notes",
      completed: progress?.notesCompleted ?? false,
    },
    {
      label: "Videos",
      completed: progress?.videosCompleted ?? false,
    },
    {
      label: "Revision",
      completed: progress?.revisionCompleted ?? false,
    },
    {
      label: "PYQs",
      completed: progress?.pyqsCompleted ?? false,
    },
  ];

  const completedItems = progressItems.filter(
    (item) => item.completed,
  ).length;

  const progressPercentage =
    progressItems.length > 0
      ? Math.round((completedItems / progressItems.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter 1 / {topic.title}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {topic.title}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            {topic.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Topic Progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Topic Progress
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {completedItems} of {progressItems.length} study tasks completed
              </h2>
            </div>

            <div className="rounded-xl bg-slate-100 px-5 py-3 text-center">
              <p className="text-2xl font-bold text-slate-900">
                {progressPercentage}%
              </p>
              <p className="text-xs font-medium text-slate-500">
                Progress
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {progressItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.completed ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Study Notes
          </h2>

          <div className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-700">
            {topic.notes}
          </div>
        </section>

        {/* Definition */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Definition
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topic.definition}
          </p>
        </section>

        {/* Real Life Example */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Real-Life Example
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topic.realLifeExample}
          </p>
        </section>

        {/* YouTube Videos */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            YouTube Lectures
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Recommended lecture searches for this topic.
          </p>

          <div className="mt-5 space-y-3">
            {topic.youtubeVideos?.map((video) => (
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
                      {video.duration ? ` • ${video.duration}` : ""}
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

        {/* Revision Points */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Revision Points
          </h2>

          <ul className="mt-5 space-y-3">
            {topic.revisionPoints.map((point) => (
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

        {/* Navigation */}
        <div className="mt-6">
          <Link
            href="/subjects/dbms/chapter-1"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Chapter 1
          </Link>
        </div>
      </div>
    </main>
  );
}