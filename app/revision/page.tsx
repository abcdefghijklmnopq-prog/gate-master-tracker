export default function RevisionPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            GATE Master Tracker
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Revision
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review completed topics, important revision points, weak areas,
            and topics that need another revision.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Topics to Revise
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Due Today
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Revision system coming next
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This section will later connect with topic progress, revision
              schedules, weak topics, and spaced revision.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}