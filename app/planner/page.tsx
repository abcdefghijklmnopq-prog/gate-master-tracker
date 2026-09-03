export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            GATE Master Tracker
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Study Planner
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Plan your daily study tasks, weekly targets, revision schedule,
            and study hours.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Today&apos;s Tasks
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Weekly Target
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0 hrs</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Study Streak
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0 days</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}