export const sortedPostList = (posts: any) => {
  return posts.sort(
    (a: any, b: any) =>
      new Date(b.posts?.createdAt || b.createdAt).getTime() -
      new Date(a.posts?.createdAt || a.createdAt).getTime()
  );
};
