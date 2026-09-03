export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            GATE Master Tracker
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Manage your GATE preparation preferences, goals, study targets,
            and application settings.
          </p>

          <div className="mt-8 space-y-4">
            <section className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                GATE Preparation
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your target year, exam preferences, subjects, and preparation
                goals will be managed here.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                Study Preferences
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Configure daily study hours, weekly targets, reminders, and
                revision preferences.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                Progress & Data
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Progress tracking, completed topics, PYQ history, and mock test
                analytics will be managed here.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}