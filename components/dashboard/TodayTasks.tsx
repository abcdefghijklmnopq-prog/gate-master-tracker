"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudyTask {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayTasks() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodayTasks() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_tasks")
        .select("id, title, description, completed")
        .eq("user_id", user.id)
        .eq("scheduled_date", getTodayDate())
        .order("created_at", { ascending: true });

      if (error) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setTasks(data ?? []);
      setLoading(false);
    }

    loadTodayTasks();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length;

  return (
    <div className="mt-6">
      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Loading today&apos;s tasks...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-700">
            No tasks yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add your daily tasks from the Study Planner.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              {completedTasks} of {tasks.length} completed
            </p>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl border p-4 ${
                  task.completed
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                      task.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium ${
                        task.completed
                          ? "text-emerald-800 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.description && (
                      <p
                        className={`mt-1 text-sm leading-5 ${
                          task.completed
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}