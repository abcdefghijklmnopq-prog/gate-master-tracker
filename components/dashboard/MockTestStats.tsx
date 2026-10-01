"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type AttemptRow = {
  id: number;
  mock_test_id: string;
  score: number;
  status: string;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_answers: number;
  total_time_seconds: number;
  submitted_at: string | null;
};

type MockTestRow = {
  id: string;
  title: string;
  total_marks: number;
};

type RecentAttempt = AttemptRow & {
  testTitle: string;
  totalMarks: number;
};

export default function MockTestStats() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [tests, setTests] = useState<MockTestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setLoggedIn(false);
        setAttempts([]);
        setTests([]);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data: attemptData } = await supabase
        .from("mock_test_attempts")
        .select(
          "id, mock_test_id, score, status, correct_answers, incorrect_answers, unanswered_answers, total_time_seconds, submitted_at",
        )
        .eq("user_id", user.id)
        .eq("status", "submitted")
        .order("submitted_at", {
          ascending: false,
        });

      const { data: testData } = await supabase
        .from("mock_tests")
        .select("id, title, total_marks")
        .eq("status", "published");

      if (cancelled) {
        return;
      }

      setAttempts((attemptData ?? []) as AttemptRow[]);
      setTests(
        (testData ?? []).map((test) => ({
          id: test.id,
          title: test.title,
          total_marks: Number(test.total_marks),
        })),
      );

      setLoading(false);
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedAttempts = useMemo(
    () =>
      attempts.filter(
        (attempt) => attempt.status === "submitted",
      ),
    [attempts],
  );

  const bestScore = useMemo(() => {
    if (completedAttempts.length === 0) {
      return null;
    }

    return Math.max(
      ...completedAttempts.map((attempt) =>
        Number(attempt.score),
      ),
    );
  }, [completedAttempts]);

  const accuracy = useMemo(() => {
    if (completedAttempts.length === 0) {
      return null;
    }

    const totals = completedAttempts.reduce(
      (result, attempt) => ({
        correct:
          result.correct + Number(attempt.correct_answers ?? 0),
        incorrect:
          result.incorrect +
          Number(attempt.incorrect_answers ?? 0),
      }),
      {
        correct: 0,
        incorrect: 0,
      },
    );

    const attemptedQuestions =
      totals.correct + totals.incorrect;

    if (attemptedQuestions === 0) {
      return null;
    }

    return (totals.correct / attemptedQuestions) * 100;
  }, [completedAttempts]);

  const averageScore = useMemo(() => {
    if (completedAttempts.length === 0) {
      return null;
    }

    let percentageTotal = 0;
    let validAttempts = 0;

    for (const attempt of completedAttempts) {
      const test = tests.find(
        (item) => item.id === attempt.mock_test_id,
      );

      if (!test || test.total_marks <= 0) {
        continue;
      }

      percentageTotal +=
        (Number(attempt.score) / test.total_marks) * 100;

      validAttempts += 1;
    }

    if (validAttempts === 0) {
      return null;
    }

    return percentageTotal / validAttempts;
  }, [completedAttempts, tests]);

  const recentAttempts = useMemo<RecentAttempt[]>(
    () =>
      completedAttempts.slice(0, 3).map((attempt) => {
        const test = tests.find(
          (item) => item.id === attempt.mock_test_id,
        );

        return {
          ...attempt,
          testTitle: test?.title ?? "Mock Test",
          totalMarks: test?.total_marks ?? 0,
        };
      }),
    [completedAttempts, tests],
  );

  if (loading) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Practice Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Mock Test Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Loading your mock test performance...
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Practice Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Mock Test Performance
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              Sign in to track mock test attempts, accuracy,
              scores, and recent submissions.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Practice Analytics
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Mock Test Performance
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Track your scores, accuracy, and latest mock test
            attempts directly from your preparation dashboard.
          </p>
        </div>

        <Link
          href="/mock-tests"
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          View all mock tests →
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Accuracy
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {accuracy === null
              ? "—"
              : `${accuracy.toFixed(1)}%`}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Correct vs attempted questions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Average Score
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {averageScore === null
              ? "—"
              : `${averageScore.toFixed(1)}%`}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Average percentage across tests
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Best Score
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {bestScore === null ? "—" : bestScore}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Highest score from completed tests
          </p>
        </div>
      </div>

      {recentAttempts.length > 0 ? (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Recent Attempts
              </p>

              <h3 className="mt-1 text-base font-bold text-slate-950">
                Latest submissions
              </h3>
            </div>

            <p className="text-xs font-medium text-slate-400">
              {completedAttempts.length} total
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {recentAttempts.map((attempt) => {
              const score = Number(attempt.score);

              const percentage =
                attempt.totalMarks > 0
                  ? (score / attempt.totalMarks) * 100
                  : 0;

              return (
                <div
                  key={attempt.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {attempt.testTitle}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {attempt.correct_answers} correct ·{" "}
                      {attempt.incorrect_answers} incorrect ·{" "}
                      {attempt.unanswered_answers} unanswered
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-950">
                        {score} / {attempt.totalMarks}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>

                    <Link
                      href={`/mock-tests/${attempt.mock_test_id}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      Retest
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-semibold text-slate-700">
            No mock tests completed yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Complete your first mock test to start building
            your performance history.
          </p>

          <Link
            href="/mock-tests"
            className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Start a Mock Test
          </Link>
        </div>
      )}
    </section>
  );
}