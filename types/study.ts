export interface StudySession {
  id: number;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  createdAt: string;
}