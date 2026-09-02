import type { Chapter } from "@/types/chapter";
import { chapterOneTopics } from "@/data/dbms/topics";

export const dbmsChapters: Chapter[] = [
  {
    id: "dbms-chapter-1",
    title: "Introduction to DBMS",
    description:
      "Learn the fundamental concepts of database management systems, data models, architecture, schema, instances, and data independence.",
    totalTopics: chapterOneTopics.length,
    completedTopics: chapterOneTopics.filter((topic) => topic.completed).length,
    topics: chapterOneTopics,
  },
];