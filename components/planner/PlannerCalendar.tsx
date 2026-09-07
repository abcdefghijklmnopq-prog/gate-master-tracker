"use client";

import { useMemo, useState } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstDayIndex = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const days: Array<Date | null> = [];

  for (let index = 0; index < firstDayIndex; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export default function PlannerCalendar() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth],
  );

  function goToPreviousMonth() {
    setCurrentMonth(
      (currentDate) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1,
        ),
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      (currentDate) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1,
        ),
    );
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Study Calendar
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Plan your study days
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            ←
          </button>

          <div className="min-w-40 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700">
            {getMonthLabel(currentMonth)}
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-500">
          Selected Date
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          {selectedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-xs font-semibold text-slate-500 sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-20 border-b border-r border-slate-200 bg-slate-50/50 p-2 sm:min-h-24"
                />
              );
            }

            const isToday = isSameDate(date, today);
            const isSelected = isSameDate(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => selectDate(date)}
                className={`min-h-20 border-b border-r border-slate-200 p-2 text-left transition sm:min-h-24 ${
                  isSelected
                    ? "bg-slate-100"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "text-slate-700"
                  }`}
                >
                  {date.getDate()}
                </div>

                {isToday && (
                  <p className="mt-2 text-[11px] font-medium text-slate-500">
                    Today
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}