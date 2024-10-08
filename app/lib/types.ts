export type Post = {
  id: number;
  content: string;
  createdAt: Date;
  authorUsername: string;
  authorEmail: string;
  authorImage: string;
  authorId: number;
  likes: string[];
};

export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  authorUsername: string;
  authorEmail: string;
  authorImage: string;
  authorId: number;
  likes: string[] | null;
};

export type UserData = {
  id: number;
  name: string;
  email: string;
  image: string;
  following: string[] | null;
  followers: string[] | null;
};
