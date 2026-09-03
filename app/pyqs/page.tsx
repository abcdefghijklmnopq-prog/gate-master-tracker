export default function PYQsPage() {
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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total Questions
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Solved
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Accuracy
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0%</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}