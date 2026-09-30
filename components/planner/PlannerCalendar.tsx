"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type PlannerCalendarProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
};

type TaskDateRow = {
  scheduled_date: string;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isToday(date: Date) {
  return isSameDate(date, new Date());
}

export default function PlannerCalendar({
  selectedDate,
  onDateSelect,
}: PlannerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(selectedDate),
  );
  const [taskDates, setTaskDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadTaskDates() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        setTaskDates(new Set());
        return;
      }

      const firstDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );

      const lastDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
      );

      const { data } = await supabase
        .from("study_tasks")
        .select("scheduled_date")
        .eq("user_id", user.id)
        .gte("scheduled_date", formatDateKey(firstDay))
        .lte("scheduled_date", formatDateKey(lastDay));

      if (cancelled) {
        return;
      }

      const dates = new Set(
        ((data ?? []) as TaskDateRow[]).map(
          (task) => task.scheduled_date,
        ),
      );

      setTaskDates(dates);
    }

    loadTaskDates();

    return () => {
      cancelled = true;
    };
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstWeekday = firstDayOfMonth.getDay();
    const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;

    const daysInMonth = lastDayOfMonth.getDate();

    const previousMonthDays = Array.from(
      { length: mondayOffset },
      (_, index) =>
        new Date(year, month, -(mondayOffset - index - 1)),
    );

    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1),
    );

    const totalCells =
      previousMonthDays.length + currentMonthDays.length;

    const trailingDays = (7 - (totalCells % 7)) % 7;

    const nextMonthDays = Array.from(
      { length: trailingDays },
      (_, index) => new Date(year, month + 1, index + 1),
    );

    return [
      ...previousMonthDays,
      ...currentMonthDays,
      ...nextMonthDays,
    ];
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1,
      ),
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(startOfMonth(today));
    onDateSelect(today);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentMonth(startOfMonth(date));
    onDateSelect(date);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Calendar Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Study Calendar
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Plan your study days
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a date to view and manage your study tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              ←
            </button>

            <div className="min-w-[155px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {monthLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              →
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
            >
              Today
            </button>
          </div>
        </div>

        {/* Selected Date */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Selected Date
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {isToday(selectedDate) && (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              Today
            </span>
          )}
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs"
            >
              {day}
            </div>
          ),
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date) => {
          const dateKey = formatDateKey(date);

          const isCurrentMonth =
            date.getMonth() === currentMonth.getMonth() &&
            date.getFullYear() === currentMonth.getFullYear();

          const selected = isSameDate(date, selectedDate);
          const today = isToday(date);
          const hasTasks = taskDates.has(dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => handleDateSelect(date)}
              className={`group relative min-h-[82px] border-b border-r border-slate-100 p-2 text-left transition sm:min-h-[96px] sm:p-3 ${
                isCurrentMonth
                  ? "bg-white hover:bg-slate-50"
                  : "bg-slate-50/60 hover:bg-slate-100/70"
              } ${
                selected
                  ? "z-10 ring-2 ring-inset ring-slate-950"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    selected
                      ? "bg-slate-950 text-white"
                      : today
                        ? "bg-slate-100 text-slate-950"
                        : isCurrentMonth
                          ? "text-slate-700 group-hover:bg-slate-100"
                          : "text-slate-300"
                  }`}
                >
                  {date.getDate()}
                </span>

                {today && !selected && (
                  <span className="mt-1 mr-1 h-1.5 w-1.5 rounded-full bg-slate-950" />
                )}
              </div>

              {hasTasks && (
                <div className="mt-4 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      selected ? "bg-white" : "bg-slate-950"
                    }`}
                  />

                  <span
                    className={`text-[10px] font-semibold ${
                      selected
                        ? "text-slate-600"
                        : "text-slate-400"
                    }`}
                  >
                    Tasks
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Footer */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-950" />
          <span>Tasks scheduled</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-950 text-[9px] text-white">
            1
          </span>
          <span>Selected date</span>
        </div>
      </div>
    </div>
  );
}