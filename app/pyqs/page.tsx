import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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

  const questions: PYQ[] = (pyqs ?? []).map((pyq) => ({
    id: pyq.id,
    year: pyq.year,
    question_number: pyq.question_number,
    question_text: pyq.question_text,
    options: (pyq.options ?? []) as PYQOption[],
    correct_answer: pyq.correct_answer,
    marks: pyq.marks,
    negative_marks: pyq.negative_marks,
    difficulty: pyq.difficulty,
    question_type: pyq.question_type,
    source: pyq.source,
    topic_id: pyq.topic_id,
    topics:
      pyq.topics && pyq.topics.length > 0
        ? {
            title: pyq.topics[0].title,
          }
        : null,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Page Header */}
            <section className="mb-8">
              <p className="text-sm font-medium text-slate-500">
                Practice Workspace
              </p>

              <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Previous Year Questions
                  </h1>

                  <p className="mt-2 max-w-2xl text-slate-600">
                    Practice GATE previous year questions subject-wise,
                    chapter-wise, topic-wise, and year-wise.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Current Subject
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Database Management System
                  </p>
                </div>
              </div>
            </section>

            {/* Error State */}
            {error ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Unable to load PYQs.
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Please check the Supabase connection and database table.
                </p>
              </div>
            ) : null}

            {/* Practice Area */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <PYQPractice questions={questions} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}