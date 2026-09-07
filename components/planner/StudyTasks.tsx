"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudyTask {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface StudyTasksProps {
  selectedDate: Date;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function StudyTasks({
  selectedDate,
}: StudyTasksProps) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedDateKey = getDateKey(selectedDate);

  useEffect(() => {
    async function loadSelectedDateTasks() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data, error: tasksError } = await supabase
        .from("study_tasks")
        .select("id, title, description, completed")
        .eq("user_id", user.id)
        .eq("scheduled_date", selectedDateKey)
        .order("created_at", { ascending: true });

      if (tasksError) {
        setError(tasksError.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      setTasks(data ?? []);
      setLoading(false);
    }

    loadSelectedDateTasks();
  }, [selectedDateKey]);

  async function addTask() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || saving) {
      return;
    }

    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please login to add study tasks.");
      setSaving(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("study_tasks")
      .insert({
        user_id: user.id,
        title: trimmedTitle,
        description: trimmedDescription || null,
        scheduled_date: selectedDateKey,
        completed: false,
      })
      .select("id, title, description, completed")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Unable to add study task.");
      setSaving(false);
      return;
    }

    setTasks((currentTasks) => [...currentTasks, data]);
    setTitle("");
    setDescription("");
    setSaving(false);
  }

  async function toggleTask(task: StudyTask) {
    setError("");

    const { error: updateError } = await supabase
      .from("study_tasks")
      .update({
        completed: !task.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? {
              ...currentTask,
              completed: !currentTask.completed,
            }
          : currentTask,
      ),
    );
  }

  async function deleteTask(taskId: number) {
    setError("");

    const { error: deleteError } = await supabase
      .from("study_tasks")
      .delete()
      .eq("id", taskId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length;

  const formattedSelectedDate = selectedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Study Tasks
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Tasks for {formattedSelectedDate}
          </h2>

          <span className="text-sm font-medium text-slate-500">
            {completedTasks}/{tasks.length} completed
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add and track the study tasks you want to complete on the
          selected date.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title, e.g. Complete DBMS normalization"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional description"
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <button
            type="button"
            onClick={addTask}
            disabled={saving || !title.trim()}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add Study Task"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm font-medium text-slate-500">
          Loading study tasks...
        </p>
      ) : tasks.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-700">
            No tasks for this date
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add your first study task above.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border p-4 transition ${
                task.completed
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  aria-label={
                    task.completed
                      ? `Mark ${task.title} as incomplete`
                      : `Mark ${task.title} as complete`
                  }
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${
                    task.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-slate-400"
                  }`}
                >
                  ✓
                </button>

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

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}