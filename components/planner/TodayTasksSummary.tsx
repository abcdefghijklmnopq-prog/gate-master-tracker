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
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodayTaskCount() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTaskCount(0);
        setLoading(false);
        return;
      }

      const { count, error } = await supabase
        .from("study_tasks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("scheduled_date", getTodayDate());

      if (error) {
        setTaskCount(0);
        setLoading(false);
        return;
      }

      setTaskCount(count ?? 0);
      setLoading(false);
    }

    loadTodayTaskCount();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        Today&apos;s Tasks
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {loading ? "—" : taskCount}
      </p>
    </div>
  );
}