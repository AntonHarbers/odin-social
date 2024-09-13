import { Post } from './types';

export const sortedPostList = (posts: Post[]) => {
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
