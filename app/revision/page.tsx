"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

type Topic = {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  revision_points: string[];
};

type Chapter = {
  id: string;
  title: string;
};

type TopicProgress = {
  topic_id: string;
  revision_completed: boolean;
};

type RevisionTopic = Topic & {
  chapterTitle: string;
  revisionCompleted: boolean;
};

export default function RevisionPage() {
  const [topics, setTopics] = useState<RevisionTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRevisionData() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setUserLoggedIn(false);
        setTopics([]);
        setLoading(false);
        return;
      }

      setUserLoggedIn(true);

      const [
        { data: topicData, error: topicError },
        { data: chapterData, error: chapterError },
        { data: progressData, error: progressError },
      ] = await Promise.all([
        supabase
          .from("topics")
          .select(
            "id, chapter_id, title, description, revision_points",
          )
          .order("created_at", { ascending: true }),

        supabase
          .from("chapters")
          .select("id, title")
          .order("created_at", { ascending: true }),

        supabase
          .from("topic_progress")
          .select("topic_id, revision_completed")
          .eq("user_id", user.id),
      ]);

      if (cancelled) {
        return;
      }

      if (topicError) {
        console.error(
          "Failed to load revision topics:",
          topicError,
        );
      }

      if (chapterError) {
        console.error(
          "Failed to load revision chapters:",
          chapterError,
        );
      }

      if (progressError) {
        console.error(
          "Failed to load revision progress:",
          progressError,
        );
      }

      const chapters = (chapterData ?? []) as Chapter[];
      const topicRows = (topicData ?? []) as Topic[];
      const progressRows = (progressData ??
        []) as TopicProgress[];

      const chapterMap = new Map(
        chapters.map((chapter) => [chapter.id, chapter.title]),
      );

      const progressMap = new Map(
        progressRows.map((progress) => [
          progress.topic_id,
          progress.revision_completed,
        ]),
      );

      const revisionTopics = topicRows
        .filter(
          (topic) =>
            Array.isArray(topic.revision_points) &&
            topic.revision_points.length > 0,
        )
        .map((topic) => ({
          ...topic,
          chapterTitle:
            chapterMap.get(topic.chapter_id) ?? "Chapter",
          revisionCompleted:
            progressMap.get(topic.id) ?? false,
        }));

      setTopics(revisionTopics);
      setLoading(false);
    }

    loadRevisionData();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedCount = useMemo(
    () =>
      topics.filter((topic) => topic.revisionCompleted).length,
    [topics],
  );

  const pendingCount = topics.length - completedCount;

  const completionPercentage =
    topics.length > 0
      ? Math.round((completedCount / topics.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {/* Header */}
            <section className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                GATE CSE 2027 · Learning Workspace
              </p>

              <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Revision
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Review topic revision points and track which
                    topics have already been revised.
                  </p>
                </div>

                <Link
                  href="/subjects/dbms"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Browse Subjects →
                </Link>
              </div>
            </section>

            {/* Summary */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Topics to Revise
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : pendingCount}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Topics with revision points
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Revision Progress
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : `${completionPercentage}%`}
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : completedCount}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Revision checkpoints completed
                </p>
              </div>
            </section>

            {/* Revision Workspace */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Revision Queue
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                    Topics with Revision Points
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Open a topic to review its notes and revision
                    points.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-20 animate-pulse rounded-xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : !userLoggedIn ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <h3 className="text-sm font-bold text-slate-900">
                      Sign in to track revision progress
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Your revision completion status is stored
                      against your account.
                    </p>

                    <Link
                      href="/login"
                      className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Login
                    </Link>
                  </div>
                ) : topics.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <h3 className="text-sm font-bold text-slate-900">
                      No revision topics available yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Revision topics will appear here when topics
                      contain revision points.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/subjects/dbms/${topic.chapter_id}/${topic.id}`}
                        className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            topic.revisionCompleted
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {topic.revisionCompleted
                            ? "✓"
                            : "R"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-400">
                            {topic.chapterTitle}
                          </p>

                          <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                            {topic.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {topic.revision_points.length} revision
                            point
                            {topic.revision_points.length === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                              topic.revisionCompleted
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {topic.revisionCompleted
                              ? "Revised"
                              : "Pending"}
                          </span>

                          <p className="mt-2 text-sm font-semibold text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-900">
                            →
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}