import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TopicProgress from "@/components/subjects/TopicProgress";
import type { Topic } from "@/types/topic";

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
  const topicIdFromRoute = `dbms-1-${topicNumber}`;

  const { data: topic, error } = await supabase
    .from("topics")
    .select(
      "id, title, description, definition, real_life_example, notes, revision_points, youtube_videos",
    )
    .eq("id", topicIdFromRoute)
    .single();

  if (error || !topic) {
    notFound();
  }

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

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter 1 / {topicData.title}
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
        {/* Topic Progress */}
        <TopicProgress topicId={topicData.id} />

        {/* Notes */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Study Notes
          </h2>

          <div className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-700">
            {topicData.notes}
          </div>
        </section>

        {/* Definition */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Definition
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topicData.definition}
          </p>
        </section>

        {/* Real Life Example */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Real-Life Example
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            {topicData.realLifeExample}
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
            {topicData.youtubeVideos?.map((video) => (
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