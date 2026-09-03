export default function MockTestsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            GATE Master Tracker
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Mock Tests
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Attempt mock tests, track your scores, analyze accuracy, and
            identify weak topics.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Tests Available
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Tests Attempted
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Best Score
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Mock test system coming next
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This section will later include full-length tests, subject-wise
              tests, timed attempts, scores, accuracy, time analysis, and
              weak-topic analytics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
