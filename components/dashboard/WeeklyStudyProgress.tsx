"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudySession {
  started_at: string;
  duration_minutes: number;
}

interface DayStudy {
  label: string;
  minutes: number;
}

const weekDays = [
  { label: "Mon", dayIndex: 1 },
  { label: "Tue", dayIndex: 2 },
  { label: "Wed", dayIndex: 3 },
  { label: "Thu", dayIndex: 4 },
  { label: "Fri", dayIndex: 5 },
  { label: "Sat", dayIndex: 6 },
  { label: "Sun", dayIndex: 0 },
];

export default function WeeklyStudyProgress() {
  const [days, setDays] = useState<DayStudy[]>(
    weekDays.map((day) => ({
      label: day.label,
      minutes: 0,
    })),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeeklyStudyProgress() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDays(
          weekDays.map((day) => ({
            label: day.label,
            minutes: 0,
          })),
        );
        setLoading(false);
        return;
      }

      const now = new Date();

      const startOfWeek = new Date(now);
      const currentDay = startOfWeek.getDay();
      const daysSinceMonday =
        currentDay === 0 ? 6 : currentDay - 1;

      startOfWeek.setDate(
        startOfWeek.getDate() - daysSinceMonday,
      );
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("study_sessions")
        .select("started_at, duration_minutes")
        .eq("user_id", user.id)
        .gte("started_at", startOfWeek.toISOString())
        .not("ended_at", "is", null);

      if (error) {
        setLoading(false);
        return;
      }

      const sessions = (data ?? []) as StudySession[];

      const weeklyData = weekDays.map((day) => {
        const totalMinutes = sessions
          .filter(
            (session) =>
              new Date(session.started_at).getDay() ===
              day.dayIndex,
          )
          .reduce(
            (total, session) =>
              total + (session.duration_minutes ?? 0),
            0,
          );

        return {
          label: day.label,
          minutes: totalMinutes,
        };
      });

      setDays(weeklyData);
      setLoading(false);
    }

    loadWeeklyStudyProgress();
  }, []);

  const maxMinutes = Math.max(
    ...days.map((day) => day.minutes),
    1,
  );

  return (
    <div className="mt-8 grid grid-cols-7 gap-3">
      {days.map((day) => {
        const barHeight =
          day.minutes > 0
            ? Math.max((day.minutes / maxMinutes) * 100, 8)
            : 2;

        return (
          <div key={day.label} className="text-center">
            <div className="flex h-40 items-end justify-center">
              <div
                className="w-full max-w-8 rounded-t-md bg-slate-900 transition-all duration-300"
                style={{
                  height: `${loading ? 2 : barHeight}%`,
                }}
                title={`${day.minutes} minutes`}
              />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500">
              {day.label}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {loading ? "—" : `${day.minutes}m`}
            </p>
          </div>
        );
      })}
    </div>
  );
}