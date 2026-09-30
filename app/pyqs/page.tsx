import { supabase } from "@/lib/supabase";
import PYQPractice from "@/components/pyqs/PYQPractice";

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

export default async function PYQsPage() {
  const { data: pyqs, error } = await supabase
    .from("pyqs")
    .select(
      `
        id,
        year,
        question_number,
        question_text,
        options,
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

          <PYQPractice questions={questions} />
        </div>
      </div>
    </main>
  );
}