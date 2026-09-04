import { supabase } from "@/lib/supabase";

export default async function SupabaseTestPage() {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, description")
    .order("id");

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Supabase Connection Test
        </h1>

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Connection failed</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="font-semibold text-emerald-700">
              Supabase connection successful
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Subjects found: {data?.length ?? 0}
            </p>

            <div className="mt-5 space-y-3">
              {data?.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h2 className="font-semibold text-slate-900">
                    {subject.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {subject.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}