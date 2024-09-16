'use server';

import { eq, inArray, sql } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import { PostsTable } from '../schema/PostSchema';
import { UsersTable } from '../schema/UserSchema';
import { LikesTable } from '../schema/LikeSchema';
import { CommentsTable } from '../schema/CommentSchema';

const db = drizzle(sqlVercel, {
  schema: { PostsTable, UsersTable, LikesTable, CommentsTable },
});

export const PostQuery = async (userEmails: string[]) => {
  return await db
    .select({
      id: PostsTable.id,
      content: PostsTable.content,
      createdAt: PostsTable.createdAt,
      authorUsername: UsersTable.name,
      authorEmail: UsersTable.email,
      authorImage: UsersTable.image,
      authorId: UsersTable.id,
      likes: sql<string[]>`array_agg(DISTINCT${LikesTable.userEmail})`.as(
        'likes'
      ),
      comments: sql<string[]>`array_agg(DISTINCT ${CommentsTable.content})`.as(
        'comments'
      ),
    })
    .from(PostsTable)
    .innerJoin(UsersTable, eq(PostsTable.user, UsersTable.email))
    .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.postId))
    .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.postId))
    .where(inArray(UsersTable.email, userEmails))
    .groupBy(
      PostsTable.id,
      UsersTable.email,
      UsersTable.name,
      UsersTable.image,
      UsersTable.id,
      PostsTable.createdAt
    );
};
