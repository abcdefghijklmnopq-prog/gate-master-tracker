"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type MockTestQuestion = {
  id: number;
  mock_test_id: string;
  pyq_id: number | null;
  question_order: number;
  marks: number;
  negative_marks: number;
};

type PYQ = {
  id: number;
  year: number;
  question_number: string | null;
  question_text: string;
  options: unknown;
  correct_answer: string | null;
  explanation: string | null;
  marks: number | null;
  negative_marks: number | null;
  difficulty: string | null;
  question_type: string | null;
};

type QuestionWithPYQ = MockTestQuestion & {
  pyq: PYQ | null;
};

type MockTestEngineProps = {
  testId: string;
  testTitle: string;
  durationMinutes: number;
  totalMarks: number;
  questions: QuestionWithPYQ[];
};

type SavedAnswer = {
  mock_test_question_id: number;
  selected_answer: string | null;
};

function formatOption(option: unknown): string {
  if (typeof option === "string") {
    return option;
  }

  if (typeof option === "number" || typeof option === "boolean") {
    return String(option);
  }

  if (option && typeof option === "object") {
    const value = option as Record<string, unknown>;

    if ("label" in value && "text" in value) {
      return `${String(value.label)}. ${String(value.text)}`;
    }

    if ("label" in value && "value" in value) {
      return `${String(value.label)}. ${String(value.value)}`;
    }

    if ("key" in value && "value" in value) {
      return `${String(value.key)}. ${String(value.value)}`;
    }

    if ("text" in value) {
      return String(value.text);
    }

    if ("value" in value) {
      return String(value.value);
    }

    return JSON.stringify(option);
  }

  return "";
}

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export default function MockTestEngine({
  testId,
  testTitle,
  durationMinutes,
  totalMarks,
  questions,
}: MockTestEngineProps) {
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [starting, setStarting] = useState(false);
  const [loadingAttempt, setLoadingAttempt] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(() => {
    return questions.filter(
      (question) =>
        answers[question.id] !== undefined &&
        answers[question.id].trim() !== "",
    ).length;
  }, [answers, questions]);

  const isCurrentAnswered =
    currentQuestion &&
    answers[currentQuestion.id] !== undefined &&
    answers[currentQuestion.id].trim() !== "";

  useEffect(() => {
    async function loadExistingAttempt() {
      setLoadingAttempt(true);
      setError("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(userError.message);
        }

        if (!user) {
          setLoadingAttempt(false);
          return;
        }

        const { data: existingAttempt, error: attemptError } =
          await supabase
            .from("mock_test_attempts")
            .select("id, mock_test_id, started_at, status")
            .eq("user_id", user.id)
            .eq("mock_test_id", testId)
            .eq("status", "in_progress")
            .order("started_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();

        if (attemptError) {
          throw new Error(attemptError.message);
        }

        if (!existingAttempt) {
          setLoadingAttempt(false);
          return;
        }

        setAttemptId(existingAttempt.id);
        setStarted(true);

        const { data: savedAnswers, error: answersError } =
          await supabase
            .from("mock_test_answers")
            .select(
              "mock_test_question_id, selected_answer",
            )
            .eq("attempt_id", existingAttempt.id);

        if (answersError) {
          throw new Error(answersError.message);
        }

        const restoredAnswers: Record<number, string> = {};

        ((savedAnswers ?? []) as SavedAnswer[]).forEach(
          (answer) => {
            if (
              answer.selected_answer !== null &&
              answer.selected_answer.trim() !== ""
            ) {
              restoredAnswers[
                answer.mock_test_question_id
              ] = answer.selected_answer;
            }
          },
        );

        setAnswers(restoredAnswers);
      } catch (loadError) {
        console.error(
          "Failed to restore mock test attempt:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to restore your test attempt.",
        );
      } finally {
        setLoadingAttempt(false);
      }
    }

    loadExistingAttempt();
  }, [testId]);

  async function startTest() {
    if (starting) {
      return;
    }

    setStarting(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error(
          "Please log in before starting a mock test.",
        );
      }

      const { data: existingAttempt, error: existingError } =
        await supabase
          .from("mock_test_attempts")
          .select("id, mock_test_id, started_at, status")
          .eq("user_id", user.id)
          .eq("mock_test_id", testId)
          .eq("status", "in_progress")
          .order("started_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (existingError) {
        throw new Error(existingError.message);
      }

      let activeAttemptId: number;

      if (existingAttempt) {
        activeAttemptId = existingAttempt.id;
      } else {
        const { data: newAttempt, error: attemptError } =
          await supabase
            .from("mock_test_attempts")
            .insert({
              user_id: user.id,
              mock_test_id: testId,
              status: "in_progress",
              score: 0,
              correct_answers: 0,
              incorrect_answers: 0,
              unanswered_answers: 0,
              total_time_seconds: 0,
            })
            .select(
              "id, mock_test_id, started_at, status",
            )
            .single();

        if (attemptError) {
          throw new Error(attemptError.message);
        }

        activeAttemptId = newAttempt.id;
      }

      setAttemptId(activeAttemptId);

      const { data: savedAnswers, error: answersError } =
        await supabase
          .from("mock_test_answers")
          .select(
            "mock_test_question_id, selected_answer",
          )
          .eq("attempt_id", activeAttemptId);

      if (answersError) {
        throw new Error(answersError.message);
      }

      const restoredAnswers: Record<number, string> = {};

      ((savedAnswers ?? []) as SavedAnswer[]).forEach(
        (answer) => {
          if (
            answer.selected_answer !== null &&
            answer.selected_answer.trim() !== ""
          ) {
            restoredAnswers[
              answer.mock_test_question_id
            ] = answer.selected_answer;
          }
        },
      );

      setAnswers(restoredAnswers);
      setStarted(true);
      setCurrentIndex(0);
    } catch (startError) {
      console.error(
        "Failed to start or resume mock test:",
        startError,
      );

      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start the mock test.",
      );
    } finally {
      setStarting(false);
    }
  }

  async function saveAnswer(
    questionId: number,
    selectedAnswer: string,
  ) {
    if (!attemptId) {
      return;
    }

    setSaving(true);
    setError("");

    setAnswers((previous) => ({
      ...previous,
      [questionId]: selectedAnswer,
    }));

    const { error: answerError } = await supabase
      .from("mock_test_answers")
      .upsert(
        {
          attempt_id: attemptId,
          mock_test_question_id: questionId,
          selected_answer: selectedAnswer,
          is_correct: null,
        },
        {
          onConflict:
            "attempt_id,mock_test_question_id",
        },
      );

    if (answerError) {
      console.error(
        "Failed to save mock test answer:",
        answerError,
      );

      setError(
        "Answer was selected, but could not be saved. Please try again.",
      );
    }

    setSaving(false);
  }

  function goToPrevious() {
    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0),
    );
  }

  function goToNext() {
    setCurrentIndex((previous) =>
      Math.min(previous + 1, questions.length - 1),
    );
  }

  if (loadingAttempt) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="text-sm font-medium text-slate-600">
            Checking your test attempt...
          </p>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Test Engine
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              Ready to attempt {testTitle}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Start the test to create your personal attempt and
              begin answering questions. Your selected answers will
              be saved automatically.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {questions.length} Questions
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {totalMarks} Marks
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {durationMinutes} Minutes
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={startTest}
            disabled={starting || questions.length === 0}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? "Starting Test..." : "Start Test →"}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">
          No questions available
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          This mock test does not contain any questions yet.
        </p>
      </section>
    );
  }

  const options = Array.isArray(currentQuestion.pyq?.options)
    ? currentQuestion.pyq.options
    : [];

  const isMCQ =
    currentQuestion.pyq?.question_type?.toUpperCase() ===
      "MCQ" && options.length > 0;

  const currentAnswer = answers[currentQuestion.id] ?? "";

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Live Test
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              {testTitle}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl bg-slate-100 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Answered
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-950">
                {answeredCount} / {questions.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Duration
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-950">
                {durationMinutes} min
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                Timer
              </p>

              <p className="mt-0.5 text-sm font-bold text-amber-700">
                Coming next
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-300"
              style={{
                width: `${
                  ((currentIndex + 1) / questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_250px]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                {currentQuestion.question_order}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {currentQuestion.pyq?.year
                    ? `GATE ${currentQuestion.pyq.year}`
                    : "Mock Question"}

                  {currentQuestion.pyq?.question_number
                    ? ` · Q${currentQuestion.pyq.question_number}`
                    : ""}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {currentQuestion.pyq?.question_type ??
                    "Question"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {currentQuestion.marks}{" "}
                {currentQuestion.marks === 1
                  ? "mark"
                  : "marks"}
              </span>

              {currentQuestion.negative_marks > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                  -{currentQuestion.negative_marks}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="text-base leading-8 text-slate-900">
              {currentQuestion.pyq?.question_text ??
                "Question content is not available."}
            </p>
          </div>

          {isMCQ && (
            <div className="mt-6 space-y-3">
              {options.map((option, index) => {
                const value = formatOption(option);
                const selected = currentAnswer === value;

                return (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    onClick={() =>
                      saveAnswer(currentQuestion.id, value)
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left text-sm transition-all ${
                      selected
                        ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected
                          ? "bg-white text-slate-950"
                          : "bg-white text-slate-500"
                      }`}
                    >
                      {getOptionLabel(index)}
                    </span>

                    <span className="pt-1 leading-6">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!isMCQ && (
            <div className="mt-6">
              <label
                htmlFor={`answer-${currentQuestion.id}`}
                className="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Enter your answer
              </label>

              <input
                id={`answer-${currentQuestion.id}`}
                type="text"
                value={currentAnswer}
                onChange={(event) =>
                  setAnswers((previous) => ({
                    ...previous,
                    [currentQuestion.id]:
                      event.target.value,
                  }))
                }
                onBlur={() =>
                  saveAnswer(
                    currentQuestion.id,
                    currentAnswer.trim(),
                  )
                }
                placeholder="Type your numerical answer"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              />

              <p className="mt-2 text-xs text-slate-400">
                Your answer will be saved when you leave this
                field.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              {saving ? (
                <p className="text-xs font-medium text-slate-400">
                  Saving answer...
                </p>
              ) : isCurrentAnswered ? (
                <p className="text-xs font-medium text-emerald-600">
                  ✓ Answer saved
                </p>
              ) : (
                <p className="text-xs font-medium text-slate-400">
                  Not answered yet
                </p>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-400">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Question Navigator
            </p>

            <h3 className="mt-1 text-base font-bold text-slate-950">
              Jump to Question
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const answered =
                answers[question.id] !== undefined &&
                answers[question.id].trim() !== "";

              const active = index === currentIndex;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex h-10 items-center justify-center rounded-lg text-xs font-bold transition ${
                    active
                      ? "bg-slate-950 text-white"
                      : answered
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {index + 1}

                  {answered && !active && (
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded bg-slate-950" />
              Current
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded bg-emerald-100" />
              Answered
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 rounded bg-slate-100" />
              Not answered
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">
              Submission
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Submit and scoring will be enabled in the next
              engine step.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        <p className="text-center text-xs font-medium text-slate-400">
          {answeredCount} of {questions.length} answered
        </p>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </section>
  );
}