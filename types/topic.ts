export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  channel: string;
  duration?: string;
}

export interface TopicProgress {
  notesCompleted: boolean;
  videosCompleted: boolean;
  revisionCompleted: boolean;
  pyqsCompleted: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  definition: string;
  realLifeExample: string;
  revisionPoints: string[];
  completed: boolean;

  // Study resources
  notes?: string;
  youtubeVideos?: YouTubeVideo[];

  // Detailed progress tracking
  progress?: TopicProgress;
}