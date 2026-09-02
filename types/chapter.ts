import type { Topic } from "@/types/topic";

export interface Chapter {
  id: string;
  title: string;
  description: string;
  totalTopics: number;
  completedTopics: number;
  topics: Topic[];
}