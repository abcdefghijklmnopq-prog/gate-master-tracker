"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ActivityItem = {
  id: string;
  type: "mock" | "pyq" | "topic" | "study";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
};

type MockAttempt = {
  id: number;
  mock_test_id: string;
  score: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_answers: number;
  submitted_at: string | null;
};

type MockTest = {
  id: string;
  title: string;
  total_marks: number;
};

type PYQAttempt = {
  id: number;
  pyq_id: number;
  is_correct: boolean;
  answered_at: string;
};

type PYQ = {
  id: number;
  year: number;
  question_number: string | null;
};

type TopicProgress = {
  topic_id: string;
  notes_completed: boolean;
  videos_completed: boolean;
  revision_completed: boolean;
  pyqs_completed: boolean;
  updated_at: string;
};

type Topic = {
  id: string;
  title: string;
};

type StudySession = {
  id: number;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
};

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();

  const difference = now.getTime() - date.getTime();
  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getActivityIcon(type: ActivityItem["type"]) {
  if (type === "mock") {
    return "✓";
  }

  if (type === "pyq") {
    return "?";
  }

  if (type === "topic") {
    return "●";
  }

  return "◷";
}

function getActivityIconClasses(type: ActivityItem["type"]) {
  if (type === "mock") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (type === "pyq") {
    return "bg-blue-50 text-blue-700";
  }

  if (type === "topic") {
    return "bg-violet-50 text-violet-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setLoggedIn(false);
        setActivities([]);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const [
        mockAttemptsResult,
        mockTestsResult,
        pyqAttemptsResult,
        pyqsResult,
        topicProgressResult,
        topicsResult,
        studySessionsResult,
      ] = await Promise.all([
        supabase
          .from("mock_test_attempts")
          .select(
            "id, mock_test_id, score, correct_answers, incorrect_answers, unanswered_answers, submitted_at",
          )
          .eq("user_id", user.id)
          .eq("status", "submitted")
          .order("submitted_at", {
            ascending: false,
          })
          .limit(5),

        supabase
          .from("mock_tests")
          .select("id, title, total_marks")
          .eq("status", "published"),

        supabase
          .from("pyq_attempts")
          .select("id, pyq_id, is_correct, answered_at")
          .eq("user_id", user.id)
          .order("answered_at", {
            ascending: false,
          })
          .limit(5),

        supabase
          .from("pyqs")
          .select("id, year, question_number"),

        supabase
          .from("topic_progress")
          .select(
            "topic_id, notes_completed, videos_completed, revision_completed, pyqs_completed, updated_at",
          )
          .eq("user_id", user.id)
          .order("updated_at", {
            ascending: false,
          })
          .limit(10),

        supabase
          .from("topics")
          .select("id, title"),

        supabase
          .from("study_sessions")
          .select("id, started_at, ended_at, duration_minutes")
          .eq("user_id", user.id)
          .order("started_at", {
            ascending: false,
          })
          .limit(5),
      ]);

      if (cancelled) {
        return;
      }

      const nextActivities: ActivityItem[] = [];

      const mockAttempts =
        (mockAttemptsResult.data ?? []) as MockAttempt[];

      const mockTests =
        (mockTestsResult.data ?? []).map((test) => ({
          id: test.id,
          title: test.title,
          total_marks: Number(test.total_marks),
        })) as MockTest[];

      const pyqAttempts =
        (pyqAttemptsResult.data ?? []) as PYQAttempt[];

      const pyqs =
        (pyqsResult.data ?? []) as PYQ[];

      const topicProgress =
        (topicProgressResult.data ?? []) as TopicProgress[];

      const topics =
        (topicsResult.data ?? []) as Topic[];

      const studySessions =
        (studySessionsResult.data ?? []) as StudySession[];

      for (const attempt of mockAttempts) {
        if (!attempt.submitted_at) {
          continue;
        }

        const test = mockTests.find(
          (item) => item.id === attempt.mock_test_id,
        );

        const totalMarks = test?.total_marks ?? 0;

        nextActivities.push({
          id: `mock-${attempt.id}`,
          type: "mock",
          title: "Mock test submitted",
          description: test
            ? `${test.title} • ${attempt.score}/${totalMarks} marks`
            : `Mock test • ${attempt.score} marks`,
          timestamp: attempt.submitted_at,
          href: `/mock-tests/${attempt.mock_test_id}`,
        });
      }

      for (const attempt of pyqAttempts) {
        const pyq = pyqs.find(
          (item) => item.id === attempt.pyq_id,
        );

        const questionLabel = pyq?.question_number
          ? `Q${pyq.question_number}`
          : "Question";

        nextActivities.push({
          id: `pyq-${attempt.id}`,
          type: "pyq",
          title: attempt.is_correct
            ? "PYQ solved correctly"
            : "PYQ attempted",
          description: pyq
            ? `${pyq.year} GATE • ${questionLabel}`
            : "Previous year question",
          timestamp: attempt.answered_at,
          href: "/pyqs",
        });
      }

      for (const progress of topicProgress) {
        const topic = topics.find(
          (item) => item.id === progress.topic_id,
        );

        const completedParts = [
          progress.notes_completed,
          progress.videos_completed,
          progress.revision_completed,
          progress.pyqs_completed,
        ].filter(Boolean).length;

        let title = "Topic progress updated";
        let description = topic?.title ?? "DBMS topic";

        if (completedParts === 4) {
          title = "Topic completed";
          description = topic?.title ?? "Topic completed";
        } else if (progress.revision_completed) {
          title = "Revision completed";
          description = topic?.title ?? "Topic revision";
        } else if (progress.pyqs_completed) {
          title = "Topic PYQs completed";
          description = topic?.title ?? "Topic PYQs";
        } else if (progress.videos_completed) {
          title = "Lecture progress updated";
          description = topic?.title ?? "Topic lecture";
        } else if (progress.notes_completed) {
          title = "Notes completed";
          description = topic?.title ?? "Topic notes";
        }

        nextActivities.push({
          id: `topic-${progress.topic_id}`,
          type: "topic",
          title,
          description,
          timestamp: progress.updated_at,
          href: `/subjects/dbms`,
        });
      }

      for (const session of studySessions) {
        if (!session.started_at) {
          continue;
        }

        const duration =
          Number(session.duration_minutes) > 0
            ? `${session.duration_minutes} min`
            : "Study session";

        nextActivities.push({
          id: `study-${session.id}`,
          type: "study",
          title: "Study session completed",
          description: duration,
          timestamp: session.ended_at ?? session.started_at,
          href: "/planner",
        });
      }

      nextActivities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime(),
      );

      setActivities(nextActivities.slice(0, 6));
      setLoading(false);
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      );
    }

    if (!loggedIn) {
      return (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-500 shadow-sm">
            →
          </div>

          <p className="mt-3 font-semibold text-slate-700">
            Sign in to track your activity
          </p>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            Your mock tests, PYQs, topic progress, and study
            sessions will appear here.
          </p>

          <Link
            href="/login"
            className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-slate-500 shadow-sm">
            •
          </div>

          <p className="mt-3 font-semibold text-slate-700">
            No recent activity
          </p>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            Complete a topic, solve a PYQ, study with the
            planner, or submit a mock test to start building
            your preparation timeline.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-5 space-y-3">
        {activities.map((activity) => {
          const activityContent = (
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getActivityIconClasses(
                  activity.type,
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {activity.title}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {activity.description}
                </p>
              </div>

              <p className="shrink-0 text-xs font-medium text-slate-400">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          );

          if (activity.href) {
            return (
              <Link
                key={activity.id}
                href={activity.href}
                className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                {activityContent}
              </Link>
            );
          }

          return (
            <div
              key={activity.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              {activityContent}
            </div>
          );
        })}
      </div>
    );
  }, [activities, loading, loggedIn]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Activity
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest preparation activity in one timeline.
          </p>
        </div>

        <Link
          href="/planner"
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          Study planner →
        </Link>
      </div>

      {content}
    </section>
  );
}