"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudySession {
  started_at: string;
  duration_minutes: number;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function StudyStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudyStreak() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStreak(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_sessions")
        .select("started_at, duration_minutes")
        .eq("user_id", user.id)
        .not("ended_at", "is", null)
        .gt("duration_minutes", 0);

      if (error) {
        setStreak(0);
        setLoading(false);
        return;
      }

      const sessions = (data ?? []) as StudySession[];

      const studyDates = new Set(
        sessions.map((session) =>
          getDateKey(new Date(session.started_at)),
        ),
      );

      let currentDate = new Date();
      let currentStreak = 0;

      while (studyDates.has(getDateKey(currentDate))) {
        currentStreak += 1;

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() - 1);
      }

      setStreak(currentStreak);
      setLoading(false);
    }

    loadStudyStreak();
  }, []);

  const streakLabel = streak === 1 ? "Day" : "Days";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        Study Streak
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {loading ? "—" : `${streak} ${streakLabel}`}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {streak > 0
          ? "Keep the streak going"
          : "Start your streak today"}
      </p>
    </div>
  );
}