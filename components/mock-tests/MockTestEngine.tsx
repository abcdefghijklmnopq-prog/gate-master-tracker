"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type ExistingAttempt = {
  id: number;
  mock_test_id: string;
  started_at: string;
  status: string;
};

type TestResult = {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredAnswers: number;
  totalTimeSeconds: number;
};

function formatOption(option: unknown): string {
  if (typeof option === "string") {
    return option;
  }

  if (
    typeof option === "number" ||
    typeof option === "boolean"
  ) {
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

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
}

function normalizeAnswer(
  question: QuestionWithPYQ,
  answer: string,
): string {
  const cleanedAnswer = answer.trim();

  if (!cleanedAnswer) {
    return "";
  }

  const options = Array.isArray(question.pyq?.options)
    ? question.pyq.options
    : [];

  const questionType =
    question.pyq?.question_type?.toUpperCase();

  if (questionType === "MCQ" && options.length > 0) {
    const selectedIndex = options.findIndex(
      (option) =>
        formatOption(option).trim() === cleanedAnswer,
    );

    if (selectedIndex >= 0) {
      return getOptionLabel(selectedIndex);
    }

    const upperAnswer = cleanedAnswer.toUpperCase();

    if (/^[A-Z]$/.test(upperAnswer)) {
      return upperAnswer;
    }

    const labelMatch = upperAnswer.match(
      /^([A-Z])\s*[\.\):-]/,
    );

    if (labelMatch) {
      return labelMatch[1];
    }
  }

  return cleanedAnswer
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function calculateResult(
  questions: QuestionWithPYQ[],
  answers: Record<number, string>,
) {
  let score = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredAnswers = 0;

  const correctness: Record<number, boolean | null> = {};

  questions.forEach((question) => {
    const selectedAnswer =
      answers[question.id]?.trim() ?? "";

    const correctAnswer =
      question.pyq?.correct_answer?.trim() ?? "";

    if (!selectedAnswer) {
      unansweredAnswers += 1;
      correctness[question.id] = null;
      return;
    }

    const normalizedSelected = normalizeAnswer(
      question,
      selectedAnswer,
    );

    const normalizedCorrect = normalizeAnswer(
      question,
      correctAnswer,
    );

    const isCorrect =
      normalizedSelected === normalizedCorrect;

    correctness[question.id] = isCorrect;

    if (isCorrect) {
      correctAnswers += 1;
      score += Number(question.marks);
    } else {
      incorrectAnswers += 1;
      score -= Number(question.negative_marks);
    }
  });

  return {
    score,
    correctAnswers,
    incorrectAnswers,
    unansweredAnswers,
    correctness,
  };
}

export default function MockTestEngine({
  testId,
  testTitle,
  durationMinutes,
  totalMarks,
  questions,
}: MockTestEngineProps) {
  const [started, setStarted] = useState(false);

  const [attemptId, setAttemptId] = useState<number | null>(
    null,
  );

  const [attemptStartedAt, setAttemptStartedAt] =
    useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>(
    {},
  );

  const [starting, setStarting] = useState(false);
  const [loadingAttempt, setLoadingAttempt] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [remainingSeconds, setRemainingSeconds] = useState(
    durationMinutes * 60,
  );

  const [timeExpired, setTimeExpired] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState<TestResult | null>(
    null,
  );

  const submissionStartedRef = useRef(false);

  const answeredCount = useMemo(() => {
    return questions.filter(
      (question) =>
        answers[question.id] !== undefined &&
        answers[question.id].trim() !== "",
    ).length;
  }, [answers, questions]);

  const allQuestionsAnswered =
    questions.length > 0 &&
    answeredCount === questions.length;

  const currentQuestion = questions[currentIndex];

  const isCurrentAnswered =
    currentQuestion &&
    answers[currentQuestion.id] !== undefined &&
    answers[currentQuestion.id].trim() !== "";

  const timerIsCritical = remainingSeconds <= 30;

  const timerIsWarning =
    remainingSeconds <= 120 && remainingSeconds > 30;

  const submitAttempt = useCallback(
    async (
      activeAttemptId: number,
      activeStartedAt: string,
      currentAnswers: Record<number, string>,
    ) => {
      if (submissionStartedRef.current) {
        return;
      }

      submissionStartedRef.current = true;

      setSubmitting(true);
      setError("");

      try {
        const calculated = calculateResult(
          questions,
          currentAnswers,
        );

        const elapsedSeconds = Math.max(
          Math.floor(
            (Date.now() -
              new Date(activeStartedAt).getTime()) /
              1000,
          ),
          0,
        );

        const totalTimeSeconds = Math.min(
          elapsedSeconds,
          durationMinutes * 60,
        );

        for (const question of questions) {
          const selectedAnswer =
            currentAnswers[question.id]?.trim() ?? "";

          const isCorrect =
            calculated.correctness[question.id];

          const { error: answerUpdateError } =
            await supabase
              .from("mock_test_answers")
              .upsert(
                {
                  attempt_id: activeAttemptId,
                  mock_test_question_id: question.id,
                  selected_answer:
                    selectedAnswer || null,
                  is_correct:
                    isCorrect === null
                      ? null
                      : isCorrect,
                },
                {
                  onConflict:
                    "attempt_id,mock_test_question_id",
                },
              );

          if (answerUpdateError) {
            throw new Error(
              answerUpdateError.message,
            );
          }
        }

        const { error: attemptUpdateError } =
          await supabase
            .from("mock_test_attempts")
            .update({
              submitted_at: new Date().toISOString(),
              status: "submitted",
              score: calculated.score,
              correct_answers:
                calculated.correctAnswers,
              incorrect_answers:
                calculated.incorrectAnswers,
              unanswered_answers:
                calculated.unansweredAnswers,
              total_time_seconds: totalTimeSeconds,
            })
            .eq("id", activeAttemptId);

        if (attemptUpdateError) {
          throw new Error(
            attemptUpdateError.message,
          );
        }

        setResult({
          score: calculated.score,
          correctAnswers:
            calculated.correctAnswers,
          incorrectAnswers:
            calculated.incorrectAnswers,
          unansweredAnswers:
            calculated.unansweredAnswers,
          totalTimeSeconds,
        });

        setSubmitted(true);
        setStarted(false);
        setTimeExpired(false);
      } catch (submitError) {
        submissionStartedRef.current = false;

        console.error(
          "Failed to submit mock test:",
          submitError,
        );

        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to submit the test.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [durationMinutes, questions],
  );

  useEffect(() => {
    let cancelled = false;

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
          if (!cancelled) {
            setLoadingAttempt(false);
          }

          return;
        }

        const {
          data: existingAttempt,
          error: attemptError,
        } = await supabase
          .from("mock_test_attempts")
          .select(
            "id, mock_test_id, started_at, status",
          )
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
          if (!cancelled) {
            setLoadingAttempt(false);
          }

          return;
        }

        const restoredAttempt =
          existingAttempt as ExistingAttempt;

        const {
          data: savedAnswers,
          error: answersError,
        } = await supabase
          .from("mock_test_answers")
          .select(
            "mock_test_question_id, selected_answer",
          )
          .eq("attempt_id", restoredAttempt.id);

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

        const elapsedSeconds = Math.floor(
          (Date.now() -
            new Date(
              restoredAttempt.started_at,
            ).getTime()) /
            1000,
        );

        const remaining = Math.max(
          durationMinutes * 60 - elapsedSeconds,
          0,
        );

        if (cancelled) {
          return;
        }

        setAttemptId(restoredAttempt.id);

        setAttemptStartedAt(
          restoredAttempt.started_at,
        );

        setAnswers(restoredAnswers);

        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          setStarted(true);
          setTimeExpired(true);

          window.setTimeout(() => {
            if (!cancelled) {
              submitAttempt(
                restoredAttempt.id,
                restoredAttempt.started_at,
                restoredAnswers,
              );
            }
          }, 0);
        } else {
          setStarted(true);
          setTimeExpired(false);
        }
      } catch (loadError) {
        console.error(
          "Failed to restore mock test attempt:",
          loadError,
        );

        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to restore your test attempt.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAttempt(false);
        }
      }
    }

    loadExistingAttempt();

    return () => {
      cancelled = true;
    };
  }, [
    durationMinutes,
    submitAttempt,
    testId,
  ]);

  useEffect(() => {
    if (
      !started ||
      !attemptStartedAt ||
      timeExpired ||
      submitted
    ) {
      return;
    }

    const activeStartedAt = attemptStartedAt;

    const totalDurationSeconds =
      durationMinutes * 60;

    const startedTimestamp = new Date(
      activeStartedAt,
    ).getTime();

    function updateTimer() {
      const elapsedSeconds = Math.floor(
        (Date.now() - startedTimestamp) / 1000,
      );

      const remaining = Math.max(
        totalDurationSeconds - elapsedSeconds,
        0,
      );

      setRemainingSeconds(remaining);

      if (
        remaining <= 0 &&
        !submissionStartedRef.current &&
        attemptId
      ) {
        setTimeExpired(true);

        window.setTimeout(() => {
          submitAttempt(
            attemptId,
            activeStartedAt,
            answers,
          );
        }, 0);
      }
    }

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    started,
    attemptStartedAt,
    durationMinutes,
    timeExpired,
    submitted,
    attemptId,
    answers,
    submitAttempt,
  ]);

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

      const {
        data: existingAttempt,
        error: existingError,
      } = await supabase
        .from("mock_test_attempts")
        .select(
          "id, mock_test_id, started_at, status",
        )
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

      let activeAttempt: ExistingAttempt;

      if (existingAttempt) {
        activeAttempt =
          existingAttempt as ExistingAttempt;
      } else {
        const {
          data: newAttempt,
          error: attemptError,
        } = await supabase
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

        activeAttempt =
          newAttempt as ExistingAttempt;
      }

      const {
        data: savedAnswers,
        error: answersError,
      } = await supabase
        .from("mock_test_answers")
        .select(
          "mock_test_question_id, selected_answer",
        )
        .eq("attempt_id", activeAttempt.id);

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

      const elapsedSeconds = Math.floor(
        (Date.now() -
          new Date(
            activeAttempt.started_at,
          ).getTime()) /
          1000,
      );

      const remaining = Math.max(
        durationMinutes * 60 - elapsedSeconds,
        0,
      );

      submissionStartedRef.current = false;

      setAttemptId(activeAttempt.id);

      setAttemptStartedAt(
        activeAttempt.started_at,
      );

      setAnswers(restoredAnswers);

      setRemainingSeconds(remaining);

      setResult(null);
      setSubmitted(false);
      setTimeExpired(remaining <= 0);

      if (remaining <= 0) {
        window.setTimeout(() => {
          submitAttempt(
            activeAttempt.id,
            activeAttempt.started_at,
            restoredAnswers,
          );
        }, 0);

        return;
      }

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
    if (
      !attemptId ||
      timeExpired ||
      submitted
    ) {
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
    if (timeExpired || submitted) {
      return;
    }

    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0),
    );
  }

  function goToNext() {
    if (timeExpired || submitted) {
      return;
    }

    setCurrentIndex((previous) =>
      Math.min(
        previous + 1,
        questions.length - 1,
      ),
    );
  }

  function handleSubmit() {
    if (
      !attemptId ||
      !attemptStartedAt ||
      submitting ||
      submitted ||
      timeExpired
    ) {
      return;
    }

    const unanswered =
      questions.length - answeredCount;

    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question${
          unanswered === 1 ? "" : "s"
        }. Do you still want to submit the test?`,
      );

      if (!confirmed) {
        return;
      }
    } else {
      const confirmed = window.confirm(
        "You have answered all questions. Submit the test now?",
      );

      if (!confirmed) {
        return;
      }
    }

    submitAttempt(
      attemptId,
      attemptStartedAt,
      answers,
    );
  }

  function handleRetest() {
    submissionStartedRef.current = false;

    setResult(null);
    setSubmitted(false);
    setStarted(false);
    setTimeExpired(false);
    setError("");
    setAnswers({});
    setCurrentIndex(0);
    setAttemptId(null);
    setAttemptStartedAt(null);
    setRemainingSeconds(durationMinutes * 60);
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

  if (submitted && result) {
    const percentage =
      totalMarks > 0
        ? (result.score / totalMarks) * 100
        : 0;

    return (
      <section className="mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Test Submitted
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {testTitle}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your mock test has been submitted and scored.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-slate-950 p-7 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Final Score
            </p>

            <p className="mt-2 text-5xl font-black tracking-tight">
              {result.score}
              <span className="text-2xl text-slate-400">
                {" "}
                / {totalMarks}
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {percentage.toFixed(1)}%
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Correct
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {result.correctAnswers}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Incorrect
              </p>

              <p className="mt-1 text-2xl font-bold text-red-700">
                {result.incorrectAnswers}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Unanswered
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-700">
                {result.unansweredAnswers}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Time Used
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-700">
                {formatTime(result.totalTimeSeconds)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleRetest}
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Retest ↻
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Scoring
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Correct answers receive their question marks.
              Incorrect answers receive the configured negative
              marks. Unanswered questions receive zero marks.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
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
            disabled={
              starting || questions.length === 0
            }
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting
              ? "Starting Test..."
              : "Start Test →"}
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

  const options = Array.isArray(
    currentQuestion.pyq?.options,
  )
    ? currentQuestion.pyq.options
    : [];

  const isMCQ =
    currentQuestion.pyq?.question_type?.toUpperCase() ===
      "MCQ" && options.length > 0;

  const currentAnswer =
    answers[currentQuestion.id] ?? "";

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
              Question {currentIndex + 1} of{" "}
              {questions.length}
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

            <div
              className={`rounded-xl px-4 py-2.5 ${
                timerIsCritical
                  ? "bg-red-50"
                  : timerIsWarning
                    ? "bg-amber-50"
                    : "bg-slate-950"
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  timerIsCritical
                    ? "text-red-600"
                    : timerIsWarning
                      ? "text-amber-600"
                      : "text-slate-400"
                }`}
              >
                Time Left
              </p>

              <p
                className={`mt-0.5 text-lg font-bold tabular-nums ${
                  timerIsCritical
                    ? "text-red-700"
                    : timerIsWarning
                      ? "text-amber-700"
                      : "text-white"
                }`}
              >
                {formatTime(remainingSeconds)}
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
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {timeExpired && !submitted && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">
            {submitting
              ? "Submitting Test"
              : "Time Expired"}
          </p>

          <h2 className="mt-1 text-lg font-bold text-amber-900">
            {submitting
              ? "Calculating your result..."
              : "Your test time has ended."}
          </h2>

          <p className="mt-1 text-sm text-amber-700">
            {submitting
              ? "Please wait while your answers are evaluated."
              : "Your saved answers are being prepared for submission."}
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_250px]">
        <article
          className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
            timeExpired ? "opacity-75" : ""
          }`}
        >
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

                const selected =
                  currentAnswer === value;

                return (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    disabled={
                      timeExpired ||
                      submitted ||
                      saving
                    }
                    onClick={() =>
                      saveAnswer(
                        currentQuestion.id,
                        value,
                      )
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left text-sm transition-all ${
                      selected
                        ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
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
                disabled={
                  timeExpired || submitted
                }
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
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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
                  onClick={() => {
                    if (
                      !timeExpired &&
                      !submitted
                    ) {
                      setCurrentIndex(index);
                    }
                  }}
                  disabled={
                    timeExpired || submitted
                  }
                  className={`relative flex h-10 items-center justify-center rounded-lg text-xs font-bold transition ${
                    active
                      ? "bg-slate-950 text-white"
                      : answered
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
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
              You can submit manually anytime. The test will also
              submit automatically when the timer reaches zero.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              submitted ||
              timeExpired ||
              !attemptId
            }
            className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Submitting..."
              : "Submit Test"}
          </button>

          {allQuestionsAnswered && !submitting && (
            <p className="mt-2 text-center text-[11px] font-medium text-emerald-600">
              ✓ All questions answered
            </p>
          )}
        </aside>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={
            currentIndex === 0 ||
            timeExpired ||
            submitted
          }
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
          disabled={
            currentIndex === questions.length - 1 ||
            timeExpired ||
            submitted
          }
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </section>
  );
}