import { dbmsChapters } from "@/data/dbms/chapters";
import TopicCard from "@/components/subjects/TopicCard";

export default function DBMSChapterOnePage() {
  const chapter = dbmsChapters.find(
    (item) => item.id === "dbms-chapter-1",
  );

  if (!chapter) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Chapter not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The requested DBMS chapter could not be found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-sm font-medium text-slate-500">
            DBMS / Chapter 1
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {chapter.title}
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            {chapter.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Chapter Progress
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {chapter.completedTopics} of {chapter.totalTopics} topics
              completed
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {chapter.totalTopics > 0
                ? Math.round(
                    (chapter.completedTopics / chapter.totalTopics) * 100,
                  )
                : 0}
              %
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Progress
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-slate-900">
            Chapter Topics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Study each topic and revise the important points.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {chapter.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}