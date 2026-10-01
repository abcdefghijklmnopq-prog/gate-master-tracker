"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PYQStats() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPYQStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            setCount(0);
            setLoading(false);
          }

          return;
        }

        const { count: attemptCount, error } = await supabase
          .from("pyq_attempts")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id);

        if (cancelled) {
          return;
        }

        if (error) {
          console.error("Failed to load PYQ statistics:", error);
          setCount(0);
        } else {
          setCount(attemptCount ?? 0);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load PYQ statistics:", error);
          setCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPYQStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="text-3xl font-bold text-slate-950">
        {loading ? "—" : count}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {count === 1 ? "PYQ attempted" : "PYQs attempted"}
      </p>
    </div>
  );
}