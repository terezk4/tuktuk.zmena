export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Episode {
  id: string;
  title: string;
  spotifyUrl: string; // Full URL
  bonusText: string; // Markdown
  publishedAt: string;
  isNew: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string; // Mocking username since auth is email only in MVP
  content: string;
  createdAt: string;
  episodeId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}