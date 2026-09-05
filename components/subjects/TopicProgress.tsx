"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface TopicProgressProps {
  topicId: string;
}

interface ProgressState {
  notesCompleted: boolean;
  videosCompleted: boolean;
  revisionCompleted: boolean;
  pyqsCompleted: boolean;
}

const defaultProgress: ProgressState = {
  notesCompleted: false,
  videosCompleted: false,
  revisionCompleted: false,
  pyqsCompleted: false,
};

export default function TopicProgress({
  topicId,
}: TopicProgressProps) {
  const [progress, setProgress] =
    useState<ProgressState>(defaultProgress);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProgress() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data, error: progressError } = await supabase
        .from("topic_progress")
        .select(
          "notes_completed, videos_completed, revision_completed, pyqs_completed",
        )
        .eq("user_id", user.id)
        .eq("topic_id", topicId)
        .maybeSingle();

      if (progressError) {
        setError(progressError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setProgress({
          notesCompleted: data.notes_completed,
          videosCompleted: data.videos_completed,
          revisionCompleted: data.revision_completed,
          pyqsCompleted: data.pyqs_completed,
        });
      } else {
        setProgress(defaultProgress);
      }

      setLoading(false);
    }

    loadProgress();
  }, [topicId]);

  async function toggleProgress(
    field: keyof ProgressState,
  ) {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setSaving(false);
      return;
    }

    const updatedProgress = {
      ...progress,
      [field]: !progress[field],
    };

    setProgress(updatedProgress);

    const { error: saveError } = await supabase
      .from("topic_progress")
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          notes_completed: updatedProgress.notesCompleted,
          videos_completed: updatedProgress.videosCompleted,
          revision_completed: updatedProgress.revisionCompleted,
          pyqs_completed: updatedProgress.pyqsCompleted,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,topic_id",
        },
      );

    if (saveError) {
      setProgress(progress);
      setError(saveError.message);
    }

    setSaving(false);
  }

  const progressItems = [
    {
      label: "Notes",
      field: "notesCompleted" as const,
      completed: progress.notesCompleted,
    },
    {
      label: "Videos",
      field: "videosCompleted" as const,
      completed: progress.videosCompleted,
    },
    {
      label: "Revision",
      field: "revisionCompleted" as const,
      completed: progress.revisionCompleted,
    },
    {
      label: "PYQs",
      field: "pyqsCompleted" as const,
      completed: progress.pyqsCompleted,
    },
  ];

  const completedItems = progressItems.filter(
    (item) => item.completed,
  ).length;

  const progressPercentage = Math.round(
    (completedItems / progressItems.length) * 100,
  );

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading topic progress...
        </p>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Topic Progress
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Login to save your progress
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your Notes, Videos, Revision, and PYQs progress will be
          saved to your account.
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Topic Progress
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {completedItems} of {progressItems.length} study tasks
            completed
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

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Overall completion</span>
          <span>{progressPercentage}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {progressItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => toggleProgress(item.field)}
            disabled={saving}
            className={`rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
              item.completed
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
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

            <p
              className={`mt-2 text-xs ${
                item.completed
                  ? "text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              {item.completed
                ? "Completed"
                : "Mark as complete"}
            </p>
          </button>
        ))}
      </div>

      {saving && (
        <p className="mt-4 text-xs text-slate-500">
          Saving progress...
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}