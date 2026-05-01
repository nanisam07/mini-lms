export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: { url: string; localPath: string };
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Course {
  url: string;
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
}

export interface Bookmark {
  courseId: string;
  savedAt: string;
}
