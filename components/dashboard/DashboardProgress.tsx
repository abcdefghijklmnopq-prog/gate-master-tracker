"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardProgressProps {
  topicIds: string[];
  mode: "topics-completed" | "dbms-progress" | "overall-progress";
}

interface ProgressRow {
  topic_id: string;
  notes_completed: boolean;
  videos_completed: boolean;
  revision_completed: boolean;
  pyqs_completed: boolean;
}

export default function DashboardProgress({
  topicIds,
  mode,
}: DashboardProgressProps) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardProgress() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || topicIds.length === 0) {
        setValue(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("topic_progress")
        .select(
          "topic_id, notes_completed, videos_completed, revision_completed, pyqs_completed",
        )
        .eq("user_id", user.id)
        .in("topic_id", topicIds);

      if (error) {
        setValue(0);
        setLoading(false);
        return;
      }

      const progressRows = (data ?? []) as ProgressRow[];

      const completedTopics = progressRows.filter(
        (row) =>
          row.notes_completed === true &&
          row.videos_completed === true &&
          row.revision_completed === true &&
          row.pyqs_completed === true,
      ).length;

      if (mode === "topics-completed") {
        setValue(completedTopics);
      } else {
        const progressPercentage =
          topicIds.length > 0
            ? Math.round((completedTopics / topicIds.length) * 100)
            : 0;

        setValue(progressPercentage);
      }

      setLoading(false);
    }

    loadDashboardProgress();
  }, [topicIds, mode]);

  if (mode === "topics-completed") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Topics Completed
        </p>

        <p className="mt-3 text-3xl font-bold text-slate-900">
          {loading ? "—" : value}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Across all subjects
        </p>
      </div>
    );
  }

  if (mode === "overall-progress") {
    return (
      <span className="text-sm font-medium text-slate-500">
        {loading ? "— Overall" : `${value}% Overall`}
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900">DBMS</p>

          <p className="mt-1 text-sm text-slate-500">
            Database Management System
          </p>
        </div>

        <span className="text-sm font-semibold text-slate-600">
          {loading ? "—" : `${value}%`}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${loading ? 0 : value}%` }}
        />
      </div>
    </div>
  );
}