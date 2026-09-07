"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface TodayTasksSummaryProps {
  selectedDate: Date;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayTasksSummary({
  selectedDate,
}: TodayTasksSummaryProps) {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectedDateKey = getDateKey(selectedDate);

  useEffect(() => {
    async function loadSelectedDateTaskSummary() {
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
        .eq("scheduled_date", selectedDateKey);

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

    loadSelectedDateTaskSummary();
  }, [selectedDateKey]);

  const formattedSelectedDate = selectedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        Tasks for Selected Date
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {loading ? "—" : `${completedTasks} / ${totalTasks}`}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {formattedSelectedDate}
      </p>
    </div>
  );
}