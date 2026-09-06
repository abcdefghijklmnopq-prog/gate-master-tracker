"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WeeklyTargetSummary() {
  const [weeklyTarget, setWeeklyTarget] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeeklyTarget() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setWeeklyTarget(20);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("study_goals")
        .select("weekly_target_hours")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setWeeklyTarget(20);
        setLoading(false);
        return;
      }

      if (data) {
        setWeeklyTarget(data.weekly_target_hours);
      }

      setLoading(false);
    }

    loadWeeklyTarget();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        Weekly Target
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {loading ? "—" : `${weeklyTarget} hrs`}
      </p>
    </div>
  );
}