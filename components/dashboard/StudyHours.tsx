"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudyHours() {
  const [studyHours, setStudyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudyHours() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStudyHours(0);
        setLoading(false);
        return;
      }

      const now = new Date();

      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const daysSinceMonday = day === 0 ? 6 : day - 1;

      startOfWeek.setDate(
        startOfWeek.getDate() - daysSinceMonday,
      );
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("study_sessions")
        .select("duration_minutes")
        .eq("user_id", user.id)
        .gte("started_at", startOfWeek.toISOString())
        .not("ended_at", "is", null);

      if (error) {
        setStudyHours(0);
        setLoading(false);
        return;
      }

      const totalMinutes = (data ?? []).reduce(
        (total, session) =>
          total + (session.duration_minutes ?? 0),
        0,
      );

      const hours = Math.round((totalMinutes / 60) * 100) / 100;

      setStudyHours(hours);
      setLoading(false);
    }

    loadStudyHours();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        Study Hours
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {loading ? "—" : `${studyHours}h`}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        This week
      </p>
    </div>
  );
}