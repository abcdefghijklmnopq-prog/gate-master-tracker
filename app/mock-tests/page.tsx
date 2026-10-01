"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

type MockTestRow = {
  id: string;
  title: string;
  description: string | null;
  subject_id: string | null;
  duration_minutes: number;
  total_marks: number;
  difficulty: string | null;
  status: string;
};

type MockTestQuestionRow = {
  mock_test_id: string;
};

type SubjectRow = {
  id: string;
  name: string;
};

type AttemptRow = {
  mock_test_id: string;
  score: number;
  status: string;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_answers: number;
  total_time_seconds: number;
  submitted_at: string | null;
};

type MockTest = {
  id: string;
  title: string;
  description: string;
  questions: number;
  marks: number;
  duration: string;
  durationMinutes: number;
  difficulty: string;
  subject: string;
  status: "Available";
};

export default function MockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMockTests() {
      setLoading(true);
      setErrorMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      setUserLoggedIn(Boolean(user));

      const [
        { data: mockTestData, error: mockTestError },
        { data: questionData, error: questionError },
        { data: subjectData, error: subjectError },
      ] = await Promise.all([
        supabase
          .from("mock_tests")
          .select(
            "id, title, description, subject_id, duration_minutes, total_marks, difficulty, status",
          )
          .eq("status", "published")
          .order("created_at", { ascending: true }),

        supabase
          .from("mock_test_questions")
          .select("mock_test_id"),

        supabase
          .from("subjects")
          .select("id, name"),
      ]);

      if (cancelled) {
        return;
      }

      if (mockTestError) {
        console.error(
          "Failed to load mock tests:",
          mockTestError,
        );

        setErrorMessage(
          "Could not load mock tests. Please refresh and try again.",
        );

        setLoading(false);
        return;
      }

      if (questionError) {
        console.error(
          "Failed to load mock test questions:",
          questionError,
        );
      }

      if (subjectError) {
        console.error(
          "Failed to load subjects:",
          subjectError,
        );
      }

      let attemptRows: AttemptRow[] = [];

      if (user) {
        const { data: attemptData, error: attemptError } =
          await supabase
            .from("mock_test_attempts")
            .select(
              "mock_test_id, score, status, correct_answers, incorrect_answers, unanswered_answers, total_time_seconds, submitted_at",
            )
            .eq("user_id", user.id)
            .eq("status", "submitted")
            .order("submitted_at", {
              ascending: false,
            });

        if (cancelled) {
          return;
        }

        if (attemptError) {
          console.error(
            "Failed to load mock test attempts:",
            attemptError,
          );
        } else {
          attemptRows = (attemptData ?? []) as AttemptRow[];
        }
      }

      const tests = (mockTestData ?? []) as MockTestRow[];

      const questions = (questionData ??
        []) as MockTestQuestionRow[];

      const subjects = (subjectData ?? []) as SubjectRow[];

      const questionCountMap = new Map<string, number>();

      questions.forEach((question) => {
        questionCountMap.set(
          question.mock_test_id,
          (questionCountMap.get(question.mock_test_id) ?? 0) + 1,
        );
      });

      const subjectMap = new Map(
        subjects.map((subject) => [subject.id, subject.name]),
      );

      const formattedTests = tests.map((test) => ({
        id: test.id,
        title: test.title,
        description:
          test.description ??
          "Practice GATE-style questions and track your performance.",
        questions: questionCountMap.get(test.id) ?? 0,
        marks: Number(test.total_marks),
        duration: `${test.duration_minutes} min`,
        durationMinutes: test.duration_minutes,
        difficulty: test.difficulty ?? "Mixed",
        subject:
          subjectMap.get(test.subject_id ?? "") ?? "CSE",
        status: "Available" as const,
      }));

      setMockTests(formattedTests);
      setAttempts(attemptRows);
      setLoading(false);
    }

    loadMockTests();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableTests = useMemo(
    () => mockTests.filter((test) => test.status === "Available"),
    [mockTests],
  );

  const completedAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.status === "submitted"),
    [attempts],
  );

  const bestScore = useMemo(() => {
    if (completedAttempts.length === 0) {
      return null;
    }

    return Math.max(
      ...completedAttempts.map((attempt) => Number(attempt.score)),
    );
  }, [completedAttempts]);

  const averageScore = useMemo(() => {
    if (completedAttempts.length === 0) {
      return null;
    }

    const totalPercentage = completedAttempts.reduce(
      (sum, attempt) => {
        const test = mockTests.find(
          (item) => item.id === attempt.mock_test_id,
        );

        if (!test || test.marks <= 0) {
          return sum;
        }

        return (
          sum +
          (Number(attempt.score) / test.marks) * 100
        );
      },
      0,
    );

    return totalPercentage / completedAttempts.length;
  }, [completedAttempts, mockTests]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Page Header */}
            <section className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                GATE CSE 2027 · Practice Workspace
              </p>

              <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Mock Tests
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Attempt timed tests, track your performance, and
                    identify the topics that need more practice.
                  </p>
                </div>

                <Link
                  href="/pyqs"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Practice PYQs →
                </Link>
              </div>
            </section>

            {/* Summary */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Tests Available
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : availableTests.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Published tests ready to attempt
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Tests Attempted
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : completedAttempts.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed attempts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Best Score
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading
                    ? "—"
                    : bestScore === null
                      ? "—"
                      : bestScore}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Highest score from completed attempts
                </p>
              </div>
            </section>

            {/* Test Library */}
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Test Library
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                  Available Mock Tests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a test based on the topics you want to
                  practice.
                </p>
              </div>

              {loading ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
                    />
                  ))}
                </div>
              ) : errorMessage ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
                  <h3 className="text-sm font-bold text-red-900">
                    Mock tests could not be loaded
                  </h3>

                  <p className="mt-2 text-sm text-red-700">
                    {errorMessage}
                  </p>
                </div>
              ) : availableTests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <h3 className="text-sm font-bold text-slate-900">
                    No published mock tests yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Published mock tests will appear here when they
                    are added to the test library.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {availableTests.map((test) => (
                    <article
                      key={test.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                            MT
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-slate-950">
                                {test.title}
                              </h3>

                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                Available
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              {test.subject}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-slate-600">
                        {test.description}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Questions
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.questions}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Marks
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.marks}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.duration}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Level
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {test.difficulty}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                          {test.questions} real questions in this
                          test
                        </p>

                        <Link
                          href={`/mock-tests/${test.id}`}
                          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Start Test
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Performance Analytics */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Performance Analytics
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                    Your mock test performance
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    These metrics are calculated from your submitted
                    mock test attempts.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {loading
                        ? "—"
                        : accuracy === null
                          ? "—"
                          : `${accuracy.toFixed(1)}%`}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Accuracy
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {loading
                        ? "—"
                        : averageScore === null
                          ? "—"
                          : `${averageScore.toFixed(1)}%`}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Avg. Score
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {loading
                        ? "—"
                        : completedAttempts.length}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Attempts
                    </p>
                  </div>
                </div>
              </div>

              {!userLoggedIn && !loading && (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
                  Log in to track your mock test attempts and
                  scores.
                </div>
              )}

              {userLoggedIn &&
                !loading &&
                completedAttempts.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Recent Attempts
                        </p>

                        <h3 className="mt-1 text-base font-bold text-slate-950">
                          Your latest submissions
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {completedAttempts
                        .slice(0, 5)
                        .map((attempt, index) => {
                          const test = mockTests.find(
                            (item) =>
                              item.id === attempt.mock_test_id,
                          );

                          const score = Number(attempt.score);

                          const percentage =
                            test && test.marks > 0
                              ? (score / test.marks) * 100
                              : 0;

                          return (
                            <div
                              key={`${attempt.mock_test_id}-${attempt.submitted_at}-${index}`}
                              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {test?.title ??
                                    "Mock Test"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {attempt.correct_answers}{" "}
                                  correct ·{" "}
                                  {attempt.incorrect_answers}{" "}
                                  incorrect ·{" "}
                                  {attempt.unanswered_answers}{" "}
                                  unanswered
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-slate-950">
                                    {score} /{" "}
                                    {test?.marks ?? "—"}
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
                )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}