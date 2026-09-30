import { supabase } from "@/lib/supabase";

interface PYQ {
  id: number;
  year: number;
  question_number: string | null;
  question_text: string;
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

export default async function PYQsPage() {
  const { data: pyqs, error } = await supabase
    .from("pyqs")
    .select(
      `
        id,
        year,
        question_number,
        question_text,
        correct_answer,
        marks,
        negative_marks,
        difficulty,
        question_type,
        source,
        topic_id,
        topics (
          title
        )
      `,
    )
    .eq("subject_id", "dbms")
    .order("year", { ascending: false })
    .order("question_number");

  const questions = (pyqs ?? []) as PYQ[];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            GATE Master Tracker
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Previous Year Questions
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Practice GATE previous year questions subject-wise, chapter-wise,
            topic-wise, and year-wise.
          </p>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                Unable to load PYQs.
              </p>

              <p className="mt-1 text-sm text-red-600">
                Please check the Supabase connection and database table.
              </p>
            </div>
          ) : null}

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
                0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Accuracy
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0%
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6 space-y-4">
          {questions.map((question) => (
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

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Topic
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {question.topics?.title ?? "Topic not mapped"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Correct Answer
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {question.correct_answer ?? "Not available"}
                  </p>
                </div>
              </div>

              {question.source ? (
                <p className="mt-4 text-xs text-slate-400">
                  Source: {question.source}
                </p>
              ) : null}
            </article>
          ))}

          {!error && questions.length === 0 ? (
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
      </div>
    </main>
  );
}