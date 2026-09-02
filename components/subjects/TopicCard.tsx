import type { Topic } from "@/types/topic";

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {topic.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {topic.description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            topic.completed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {topic.completed ? "Completed" : "Pending"}
        </span>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">Definition</h4>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {topic.definition}
        </p>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">
          Real-Life Example
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {topic.realLifeExample}
        </p>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">
          Revision Points
        </h4>

        <ul className="mt-2 space-y-2">
          {topic.revisionPoints.map((point) => (
            <li
              key={point}
              className="flex gap-2 text-sm leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}