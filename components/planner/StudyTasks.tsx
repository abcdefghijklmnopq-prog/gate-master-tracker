"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StudyTask = {
  id: number;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean;
};

type StudyTasksProps = {
  selectedDate: Date;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function StudyTasks({
  selectedDate,
}: StudyTasksProps) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const selectedDateKey = formatDateKey(selectedDate);

  useEffect(() => {
    let cancelled = false;

    async function loadUserAndTasks() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setUserId(null);
        setTasks([]);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("study_tasks")
        .select(
          "id, title, description, scheduled_date, completed",
        )
        .eq("user_id", user.id)
        .eq("scheduled_date", selectedDateKey)
        .order("created_at", { ascending: true });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Failed to load study tasks:", error);
        setTasks([]);
      } else {
        setTasks((data ?? []) as StudyTask[]);
      }

      setLoading(false);
    }

    loadUserAndTasks();

    return () => {
      cancelled = true;
    };
  }, [selectedDateKey]);

  const addTask = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !userId || saving) {
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("study_tasks")
      .insert({
        user_id: userId,
        title: trimmedTitle,
        description: description.trim() || null,
        scheduled_date: selectedDateKey,
      })
      .select(
        "id, title, description, scheduled_date, completed",
      )
      .single();

    if (error) {
      console.error("Failed to add study task:", error);
      setSaving(false);
      return;
    }

    if (data) {
      setTasks((currentTasks) => [
        ...currentTasks,
        data as StudyTask,
      ]);
    }

    setTitle("");
    setDescription("");
    setSaving(false);
  };

  const toggleTask = async (task: StudyTask) => {
    const nextCompleted = !task.completed;

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? { ...currentTask, completed: nextCompleted }
          : currentTask,
      ),
    );

    const { error } = await supabase
      .from("study_tasks")
      .update({
        completed: nextCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to update study task:", error);

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? { ...currentTask, completed: task.completed }
            : currentTask,
        ),
      );
    }
  };

  const deleteTask = async (taskId: number) => {
    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );

    const { error } = await supabase
      .from("study_tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to delete study task:", error);
      setTasks(previousTasks);
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Daily Focus
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Study Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Progress
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {completedCount}/{tasks.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 px-4 py-2 text-center text-white">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Complete
              </p>

              <p className="mt-0.5 text-sm font-bold">
                {progress}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addTask();
              }
            }}
            placeholder="Add a study task..."
            disabled={!userId || saving}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addTask();
              }
            }}
            placeholder="Description (optional)"
            disabled={!userId || saving}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <button
            type="button"
            onClick={addTask}
            disabled={!userId || !title.trim() || saving}
            className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {saving ? "Adding..." : "Add Task"}
          </button>
        </div>

        {!userId && (
          <p className="mt-3 text-xs font-medium text-amber-600">
            Please log in to create and manage study tasks.
          </p>
        )}
      </div>

      {/* Task List */}
      <div className="px-5 py-5 sm:px-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
              ✓
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              No tasks for this day
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Add your study goals above and turn this day into a
              focused study session.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-start gap-3 rounded-xl border p-4 transition ${
                  task.completed
                    ? "border-slate-100 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  aria-label={
                    task.completed
                      ? "Mark task incomplete"
                      : "Mark task complete"
                  }
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                    task.completed
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-slate-500"
                  }`}
                >
                  ✓
                </button>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-sm font-semibold ${
                      task.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        task.completed
                          ? "text-slate-400"
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
                  aria-label={`Delete ${task.title}`}
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 opacity-100 transition hover:bg-slate-100 hover:text-slate-900 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}