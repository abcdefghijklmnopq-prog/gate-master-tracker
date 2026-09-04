"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ChapterProgressProps {
  topicIds: string[];
}

interface ProgressRow {
  topic_id: string;
  notes_completed: boolean;
  videos_completed: boolean;
  revision_completed: boolean;
  pyqs_completed: boolean;
}

export default function ChapterProgress({
  topicIds,
}: ChapterProgressProps) {
  const [completedTopics, setCompletedTopics] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChapterProgress() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCompletedTopics(0);
        setLoading(false);
        return;
      }

      if (topicIds.length === 0) {
        setCompletedTopics(0);
        setLoading(false);
        return;
      }

      const { data, error: progressError } = await supabase
        .from("topic_progress")
        .select(
          "topic_id, notes_completed, videos_completed, revision_completed, pyqs_completed",
        )
        .eq("user_id", user.id)
        .in("topic_id", topicIds);

      if (progressError) {
        setError(progressError.message);
        setLoading(false);
        return;
      }

      const progressRows = (data ?? []) as ProgressRow[];

      const completedCount = progressRows.filter(
        (row) =>
          row.notes_completed === true &&
          row.videos_completed === true &&
          row.revision_completed === true &&
          row.pyqs_completed === true,
      ).length;

      setCompletedTopics(completedCount);
      setLoading(false);
    }

    loadChapterProgress();
  }, [topicIds]);

  const totalTopics = topicIds.length;

  const progressPercentage =
    totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Chapter Progress
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {loading
              ? "Loading progress..."
              : `${completedTopics} of ${totalTopics} topics completed`}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "—" : `${progressPercentage}%`}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Progress
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}