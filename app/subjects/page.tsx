
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

import {
  GATE_CSE_2027_TECHNICAL_SUBJECTS,
  GATE_CSE_2027_GENERAL_APTITUDE,
  type SyllabusSubject,
} from "@/lib/gate-cse-2027-syllabus";

async function getDbmsContentCounts(): Promise<{
  chapterCount: number | null;
  topicCount: number | null;
}> {
  const { data: chapters, error: chapterError } = await supabase
    .from("chapters")
    .select("id")
    .eq("subject_id", "dbms");

  if (chapterError) {
    console.error(
      "Unable to load DBMS chapters:",
      chapterError.message
    );

    return {
      chapterCount: null,
      topicCount: null,
    };
  }

  const chapterIds = (chapters ?? []).map(
    (chapter) => chapter.id
  );

  if (chapterIds.length === 0) {
    return {
      chapterCount: 0,
      topicCount: 0,
    };
  }

  const { count, error: topicError } = await supabase
    .from("topics")
    .select("id", { count: "exact", head: true })
    .in("chapter_id", chapterIds);

  if (topicError) {
    console.error(
      "Unable to load DBMS topic count:",
      topicError.message
    );

    return {
      chapterCount: chapterIds.length,
      topicCount: null,
    };
  }

  return {
    chapterCount: chapterIds.length,
    topicCount: count ?? 0,
  };
}

type SubjectCardProps = {
  subject: SyllabusSubject;
  chapterCountOverride?: number | null;
  topicCountOverride?: number | null;
};

function SubjectCard({
  subject,
  chapterCountOverride,
  topicCountOverride,
}: SubjectCardProps) {
  const isAvailable =
    subject.status === "available" &&
    subject.href !== null;

  const chapterCount =
    chapterCountOverride === undefined
      ? subject.chapters.length
      : chapterCountOverride;

  const topicCount =
    topicCountOverride === undefined
      ? subject.chapters.reduce(
          (total, chapter) =>
            total + chapter.topics.length,
          0
        )
      : topicCountOverride;

  const cardContent = (
    <article
      className={`group h-full rounded-2xl border bg-white p-5 shadow-sm transition ${
        isAvailable
          ? "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          : "border-slate-200/80"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-2 text-center text-xs font-bold text-white">
          {subject.shortName}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isAvailable ? "Available" : "Structure added"}
        </span>
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {subject.sectionNumber !== null
          ? `Technical Section ${subject.sectionNumber}`
          : "Common Section"}
      </p>

      <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-950">
        {subject.name}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
        {subject.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xl font-bold text-slate-900">
            {chapterCount ?? "—"}
          </p>
          <p className="text-xs font-medium text-slate-400">
            Chapters
          </p>
        </div>

        <div>
          <p className="text-xl font-bold text-slate-900">
            {topicCount ?? "—"}
          </p>
          <p className="text-xs font-medium text-slate-400">
            Topics
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-400">
          {isAvailable ? "Open subject" : "Learning module"}
        </span>

        <span
          className={`text-sm font-semibold ${
            isAvailable
              ? "text-slate-900 transition group-hover:translate-x-0.5"
              : "text-slate-300"
          }`}
        >
          {isAvailable ? "Open →" : "Coming soon"}
        </span>
      </div>
    </article>
  );

  if (isAvailable && subject.href) {
    return (
      <Link
        href={subject.href}
        className="block h-full"
        aria-label={`Open ${subject.name}`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const technicalSubjects =
    GATE_CSE_2027_TECHNICAL_SUBJECTS;

  const generalAptitude =
    GATE_CSE_2027_GENERAL_APTITUDE;

  const dbmsCounts = await getDbmsContentCounts();

  const allSubjects = [
    ...technicalSubjects,
    generalAptitude,
  ];

  const totalChapters = allSubjects.reduce(
    (total, subject) =>
      total + subject.chapters.length,
    0
  );

  const totalTopics = allSubjects.reduce(
    (total, subject) =>
      total +
      subject.chapters.reduce(
        (chapterTotal, chapter) =>
          chapterTotal + chapter.topics.length,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

            {/* Page Header */}
            <section className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                GATE CSE 2027 · Official Syllabus
              </p>

              <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Subject Library
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Explore the complete GATE CSE syllabus,
                    organize your preparation and track your
                    learning subject by subject.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">
                    Exam Paper
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    CS · 2027
                  </p>
                </div>
              </div>
            </section>

            {/* Syllabus Overview */}
            <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Technical Sections",
                  value: technicalSubjects.length,
                },
                {
                  label: "Total Sections",
                  value: technicalSubjects.length + 1,
                },
                {
                  label: "Syllabus Chapters",
                  value: totalChapters,
                },
                {
                  label: "Syllabus Topics",
                  value: totalTopics,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </section>

            {/* Technical Subjects */}
            <section>
              <div className="mb-5">
                <p className="text-sm font-medium text-slate-500">
                  Computer Science and Information Technology
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Technical Subjects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  All 10 technical sections of the GATE CS paper.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {technicalSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    chapterCountOverride={
                      subject.id === "dbms"
                        ? dbmsCounts.chapterCount
                        : undefined
                    }
                    topicCountOverride={
                      subject.id === "dbms"
                        ? dbmsCounts.topicCount
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>

            {/* General Aptitude */}
            <section className="mt-10">
              <div className="mb-5">
                <p className="text-sm font-medium text-slate-500">
                  Common Section
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  General Aptitude
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Verbal, quantitative, analytical and spatial aptitude.
                </p>
              </div>

              <div className="max-w-xl">
                <SubjectCard subject={generalAptitude} />
              </div>
            </section>

            {/* Syllabus Information */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                Syllabus information
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This catalogue is the initial learning structure
                based on the GATE 2027 syllabus. Detailed notes,
                PYQs, videos, revision resources and topic progress
                will be added in subsequent development milestones.
              </p>

              <a
                href="https://gate2027.iitm.ac.in/exam_papers_and_syllabus"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                View official GATE syllabus →
              </a>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
