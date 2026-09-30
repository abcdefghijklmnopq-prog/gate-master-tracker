import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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

            {/* Breadcrumb */}
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

            {/* Test Header */}
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

              {/* Test Metadata */}
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

            {/* Question Preview */}
            <section className="mt-8">

              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Question Preview
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                  Test Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  These questions are loaded directly from the mock
                  test and PYQ database.
                </p>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

                  <h3 className="text-sm font-bold text-slate-900">
                    No questions found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    This mock test does not have any questions
                    attached yet.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {questions.map((question) => (
                    <article
                      key={question.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                    >

                      {/* Question Header */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-start gap-4">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                            {question.question_order}
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              {question.pyq?.year
                                ? `GATE ${question.pyq.year}`
                                : "Mock Question"}

                              {question.pyq?.question_number
                                ? ` · Q${question.pyq.question_number}`
                                : ""}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {question.pyq?.question_type ??
                                "Question"}
                            </p>
                          </div>

                        </div>

                        <div className="flex shrink-0 items-center gap-2">

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {question.marks}{" "}
                            {question.marks === 1
                              ? "mark"
                              : "marks"}
                          </span>

                          {question.negative_marks > 0 && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                              -{question.negative_marks}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* Question Text */}
                      <div className="mt-5 border-t border-slate-100 pt-5">

                        <p className="text-sm leading-7 text-slate-800">
                          {question.pyq?.question_text ??
                            "Question content is not available."}
                        </p>

                      </div>

                      {/* Options */}
                      {Array.isArray(question.pyq?.options) &&
                        question.pyq.options.length > 0 && (
                          <div className="mt-5 grid gap-2">

                            {question.pyq.options.map(
                              (option, index) => (
                                <div
                                  key={`${question.id}-${index}`}
                                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                >
                                  <span className="mr-2 font-semibold text-slate-500">
                                    {String.fromCharCode(
                                      65 + index,
                                    )}
                                    .
                                  </span>

                                  {formatOption(option)}
                                </div>
                              ),
                            )}

                          </div>
                        )}

                      {/* Question Footer */}
                      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs text-slate-400">
                          Answer selection will be enabled in the
                          next step.
                        </p>

                        <span className="text-xs font-semibold text-slate-400">
                          Question {question.question_order} /{" "}
                          {questions.length}
                        </span>

                      </div>

                    </article>
                  ))}

                </div>
              )}

            </section>

            {/* Next Step */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Test Engine
                  </p>

                  <h2 className="mt-1 text-lg font-bold">
                    Ready to attempt this test
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Timer, answer selection, submission, and scoring
                    will be enabled next.
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300">
                  Engine coming next
                </span>

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}