'use server';

import { Post } from '@/app/lib/types';
import { PostQuery } from './helpers';
import { and, eq } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import { PostsTable } from '../schema/PostSchema';
import { LikesTable } from '../schema/LikeSchema';

const db = drizzle(sqlVercel, { schema: { PostsTable, LikesTable } });

export const createPost = async (post: string, userEmail: string) => {
  try {
    const result = await db
      .insert(PostsTable)
      .values({ content: post, user: userEmail })
      .returning()
      .execute();
  } catch (error) {
    console.error(error);
  }
};

export const getPostsOfFollowing = async (
  userEmails: string[]
): Promise<Post[]> => {
  try {
    return await PostQuery(userEmails);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserPosts = async (email: string): Promise<Post[]> => {
  try {
    return await PostQuery([email]);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deletePost = async (id: number) => {
  try {
    const result = await db
      .delete(PostsTable)
      .where(eq(PostsTable.id, id))
      .execute();
  } catch (error) {
    console.error(error);
  }
};

export const ToggleLike = async (postId: number, userEmail: string) => {
  try {
    // check if this user email already likes this post
    const result = await db
      .select({ id: LikesTable.id })
      .from(LikesTable)
      .where(
        and(eq(LikesTable.postId, postId), eq(LikesTable.userEmail, userEmail))
      )
      .execute();

    if (result.length > 0) {
      await db
        .delete(LikesTable)
        .where(eq(LikesTable.id, result[0].id))
        .execute();
    } else {
      await db.insert(LikesTable).values({ postId, userEmail }).execute();
    }
  } catch (error) {
    console.error(error);
  }
};
