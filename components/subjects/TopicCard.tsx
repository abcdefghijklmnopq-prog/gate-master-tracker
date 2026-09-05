"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Topic } from "@/types/topic";

interface TopicCardProps {
  topic: Topic;
  chapterNumber: number;
}

export default function TopicCard({
  topic,
  chapterNumber,
}: TopicCardProps) {
  const [completed, setCompleted] = useState(topic.completed);
  const [loading, setLoading] = useState(true);

  const topicNumber = topic.id.split("-").pop();

  useEffect(() => {
    async function loadTopicProgress() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCompleted(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("topic_progress")
        .select(
          "notes_completed, videos_completed, revision_completed, pyqs_completed",
        )
        .eq("user_id", user.id)
        .eq("topic_id", topic.id)
        .maybeSingle();

      if (error) {
        setCompleted(false);
        setLoading(false);
        return;
      }

      const topicCompleted =
        data?.notes_completed === true &&
        data?.videos_completed === true &&
        data?.revision_completed === true &&
        data?.pyqs_completed === true;

      setCompleted(topicCompleted);
      setLoading(false);
    }

    loadTopicProgress();
  }, [topic.id]);

  return (
    <Link
      href={`/subjects/dbms/chapter-${chapterNumber}/topic-${topicNumber}`}
      className="block"
    >
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {topic.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {topic.description}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              loading
                ? "bg-slate-100 text-slate-500"
                : completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {loading
              ? "Loading..."
              : completed
                ? "Completed"
                : "Pending"}
          </span>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-900">
            Definition
          </h4>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {topic.definition}
          </p>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-900">
            Real-Life Example
          </h4>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {topic.realLifeExample}
          </p>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-900">
            Revision Points
          </h4>

          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
            {topic.revisionPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 text-sm font-medium text-slate-500">
          Open topic →
        </div>
      </article>
    </Link>
  );
}