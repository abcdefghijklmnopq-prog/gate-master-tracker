"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayTasksSummary() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodayTaskSummary() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTotalTasks(0);
        setCompletedTasks(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_tasks")
        .select("completed")
        .eq("user_id", user.id)
        .eq("scheduled_date", getTodayDate());

      if (error) {
        setTotalTasks(0);
        setCompletedTasks(0);
        setLoading(false);
        return;
      }

      const tasks = data ?? [];

      setTotalTasks(tasks.length);
      setCompletedTasks(
        tasks.filter((task) => task.completed === true).length,
      );
      setLoading(false);
    }

    loadTodayTaskSummary();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        Today&apos;s Tasks
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {loading ? "—" : `${completedTasks} / ${totalTasks}`}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        Completed
      </p>
    </div>
  );
}