import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MockTestEngine from "@/components/mock-tests/MockTestEngine";
import { supabase } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    testId: string;
  }>;
};

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

export default async function MockTestPage({
  params,
}: PageProps) {
  const { testId } = await params;

  const { data: testData, error: testError } = await supabase
    .from("mock_tests")
    .select(
      "id, title, description, duration_minutes, total_marks, difficulty",
    )
    .eq("id", testId)
    .eq("status", "published")
    .maybeSingle();

  if (testError) {
    console.error("Failed to load mock test:", testError);
  }

  if (!testData) {
    notFound();
  }

  const { data: questionData, error: questionError } =
    await supabase
      .from("mock_test_questions")
      .select(
        "id, mock_test_id, pyq_id, question_order, marks, negative_marks",
      )
      .eq("mock_test_id", testId)
      .order("question_order", { ascending: true });

  if (questionError) {
    console.error(
      "Failed to load mock test questions:",
      questionError,
    );
  }

  const mockQuestions = (questionData ??
    []) as MockTestQuestion[];

  const pyqIds = mockQuestions
    .map((question) => question.pyq_id)
    .filter((id): id is number => id !== null);

  let pyqRows: PYQ[] = [];

  if (pyqIds.length > 0) {
    const { data: pyqData, error: pyqError } = await supabase
      .from("pyqs")
      .select(
        "id, year, question_number, question_text, options, correct_answer, explanation, marks, negative_marks, difficulty, question_type",
      )
      .in("id", pyqIds);

    if (pyqError) {
      console.error(
        "Failed to load PYQs for mock test:",
        pyqError,
      );
    }

    pyqRows = (pyqData ?? []) as PYQ[];
  }

  const pyqMap = new Map(
    pyqRows.map((pyq) => [pyq.id, pyq]),
  );

  const questions: QuestionWithPYQ[] = mockQuestions.map(
    (question) => ({
      ...question,
      pyq:
        question.pyq_id === null
          ? null
          : pyqMap.get(question.pyq_id) ?? null,
    }),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <Link
                href="/mock-tests"
                className="transition hover:text-slate-900"
              >
                Mock Tests
              </Link>

              <span>/</span>

              <span className="text-slate-600">
                {testData.title}
              </span>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                <div className="max-w-3xl">

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    GATE CSE 2027 · Mock Test
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {testData.title}
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                    {testData.description ??
                      "Attempt this mock test using the questions provided in the test library."}
                  </p>

                </div>

                <Link
                  href="/mock-tests"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  ← Back to Tests
                </Link>

              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Questions
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {questions.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Total Marks
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {Number(testData.total_marks)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {testData.duration_minutes} min
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {testData.difficulty ?? "Mixed"}
                  </p>
                </div>

              </div>
            </section>

            <MockTestEngine
              testId={testData.id}
              testTitle={testData.title}
              durationMinutes={testData.duration_minutes}
              totalMarks={Number(testData.total_marks)}
              questions={questions}
            />

          </div>
        </main>
      </div>
    </div>
  );
}