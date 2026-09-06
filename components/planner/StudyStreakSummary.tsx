"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StudySession {
  started_at: string;
  ended_at: string | null;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateStreak(sessions: StudySession[]) {
  const studyDates = new Set(
    sessions
      .filter((session) => session.ended_at !== null)
      .map((session) => getDateKey(new Date(session.started_at))),
  );

  if (studyDates.size === 0) {
    return 0;
  }

  const today = new Date();
  const todayKey = getDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);

  let currentDate: Date;

  if (studyDates.has(todayKey)) {
    currentDate = new Date(today);
  } else if (studyDates.has(yesterdayKey)) {
    currentDate = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;

  while (studyDates.has(getDateKey(currentDate))) {
    streak += 1;

    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export default function StudyStreakSummary() {
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
        .select("started_at, ended_at")
        .eq("user_id", user.id)
        .not("ended_at", "is", null)
        .order("started_at", { ascending: false });

      if (error) {
        setStreak(0);
        setLoading(false);
        return;
      }

      setStreak(calculateStreak(data ?? []));
      setLoading(false);
    }

    loadStudyStreak();
  }, []);

  const streakLabel = streak === 1 ? "day" : "days";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        Study Streak
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {loading ? "—" : `${streak} ${streakLabel}`}
      </p>
    </div>
  );
}