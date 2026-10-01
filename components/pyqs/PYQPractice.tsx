"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PYQOption {
  key: string;
  text: string;
}

interface PYQ {
  id: number;
  year: number;
  question_number: string | null;
  question_text: string;
  options: PYQOption[];
  correct_answer: string | null;
  marks: number | null;
  negative_marks: number | null;
  difficulty: string | null;
  question_type: string | null;
  source: string | null;
  topic_id: string | null;
  topics: {
    title: string;
  } | null;
}

interface Attempt {
  pyq_id: number;
  selected_answer: string;
  is_correct: boolean;
}

interface PYQPracticeProps {
  questions: PYQ[];
}

export default function PYQPractice({
  questions,
}: PYQPracticeProps) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttempts() {
      setLoadingAttempts(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAttempts([]);
        setLoadingAttempts(false);
        return;
      }

      const { data, error } = await supabase
        .from("pyq_attempts")
        .select("pyq_id, selected_answer, is_correct")
        .eq("user_id", user.id);

      if (!error) {
        setAttempts((data ?? []) as Attempt[]);
      }

      setLoadingAttempts(false);
    }

    loadAttempts();
  }, []);

  async function submitAnswer(question: PYQ) {
    const selectedAnswer = answers[question.id];

    if (!selectedAnswer) {
      setMessage(
        `Please select or enter an answer for Q${question.question_number}.`,
      );
      return;
    }

    if (!question.correct_answer) {
      setMessage("Correct answer is not available for this question.");
      return;
    }

    setSubmittingId(question.id);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in before submitting a PYQ.");
      setSubmittingId(null);
      return;
    }

    const isCorrect =
      selectedAnswer.trim().toUpperCase() ===
      question.correct_answer.trim().toUpperCase();

    const { data, error } = await supabase
      .from("pyq_attempts")
      .upsert(
        {
          user_id: user.id,
          pyq_id: question.id,
          selected_answer: selectedAnswer.trim(),
          is_correct: isCorrect,
        },
        {
          onConflict: "user_id,pyq_id",
        },
      )
      .select("pyq_id, selected_answer, is_correct")
      .single();

    if (error) {
      setMessage("Unable to save your attempt. Please try again.");
      setSubmittingId(null);
      return;
    }

    setAttempts((current) => [
      ...current.filter((attempt) => attempt.pyq_id !== question.id),
      data as Attempt,
    ]);

    setMessage(
      isCorrect
        ? `Q${question.question_number}: Correct answer!`
        : `Q${question.question_number}: Incorrect answer.`,
    );

    setSubmittingId(null);
  }

  const solvedCount = attempts.length;

  const correctCount = attempts.filter(
    (attempt) => attempt.is_correct,
  ).length;

  const accuracy =
    solvedCount > 0
      ? Math.round((correctCount / solvedCount) * 100)
      : 0;

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            Total Questions
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {questions.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            Solved
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loadingAttempts ? "—" : solvedCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">
            Accuracy
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loadingAttempts ? "—" : `${accuracy}%`}
          </p>
        </div>
      </div>

      {message ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
          {message}
        </div>
      ) : null}

      <section className="mt-6 space-y-4">
        {questions.map((question) => {
          const attempt = attempts.find(
            (item) => item.pyq_id === question.id,
          );

          const isSubmitted = Boolean(attempt);
          const attemptIsCorrect = attempt?.is_correct ?? false;

          return (
            <article
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      GATE {question.year}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Q{question.question_number}
                    </span>

                    {question.question_type ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {question.question_type}
                      </span>
                    ) : null}

                    {question.marks !== null ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {question.marks} marks
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-lg font-semibold leading-7 text-slate-900">
                    {question.question_text}
                  </h2>
                </div>

                {question.difficulty ? (
                  <span className="shrink-0 text-sm font-medium text-slate-500">
                    {question.difficulty}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Topic
                </p>

                <p className="mt-1 font-medium text-slate-800">
                  {question.topics?.title ?? "Topic not mapped"}
                </p>
              </div>

              {question.options.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected =
                      answers[question.id] === option.key;

                    const submittedCorrect =
                      isSubmitted &&
                      option.key === question.correct_answer;

                    const submittedWrong =
                      isSubmitted &&
                      selected &&
                      !attemptIsCorrect;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option.key,
                          }))
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          submittedCorrect
                            ? "border-slate-900 bg-slate-100"
                            : submittedWrong
                              ? "border-slate-400 bg-slate-100"
                              : selected
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                        } ${
                          isSubmitted
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
                      >
                        <span className="font-semibold text-slate-900">
                          {option.key}.
                        </span>{" "}
                        <span className="text-slate-700">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5">
                  <label
                    htmlFor={`answer-${question.id}`}
                    className="text-sm font-medium text-slate-700"
                  >
                    Your Answer
                  </label>

                  <input
                    id={`answer-${question.id}`}
                    type="text"
                    value={answers[question.id] ?? ""}
                    disabled={isSubmitted}
                    onChange={(event) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: event.target.value,
                      }))
                    }
                    placeholder="Enter your answer"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {isSubmitted ? (
                    <p
                      className={`text-sm font-semibold ${
                        attemptIsCorrect
                          ? "text-slate-900"
                          : "text-slate-600"
                      }`}
                    >
                      {attemptIsCorrect
                        ? "Correct"
                        : "Incorrect"}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Select your answer and submit.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    isSubmitted || submittingId === question.id
                  }
                  onClick={() => submitAnswer(question)}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingId === question.id
                    ? "Saving..."
                    : isSubmitted
                      ? "Submitted"
                      : "Submit Answer"}
                </button>
              </div>

              {isSubmitted ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Correct Answer
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {question.correct_answer}
                  </p>
                </div>
              ) : null}

              {question.source ? (
                <p className="mt-4 text-xs text-slate-400">
                  Source: {question.source}
                </p>
              ) : null}
            </article>
          );
        })}

        {!loadingAttempts && questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              No PYQs available yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Verified GATE questions will appear here as they are added.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}