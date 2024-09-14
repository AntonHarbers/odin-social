'use server';

import '@/drizzle/envConfig';
import { sql as sqlVercel } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { Post, UserData } from '../app/lib/types';

const db = drizzle(sqlVercel, { schema });

export const getUsers = async (): Promise<UserData[]> => {
  try {
    const users = await db.query.UsersTable.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  try {
    const user = await db.query.UsersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserDataById = async (
  id: number
): Promise<{ user: any; posts: Post[] }> => {
  const user = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  }).execute();

  if (!user) return { user: null, posts: [] };

  const posts = await PostQuery([user.email]);

  return { user, posts };
};

export const createUser = async (
  name: string,
  email: string,
  image: string
) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('creating user');
      db.insert(schema.UsersTable).values({ name, email, image }).execute();
    }
  } catch (error) {
    console.error(error);
  }
};

export const createPost = async (post: string, userEmail: string) => {
  try {
    const result = await db
      .insert(schema.PostsTable)
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
      .delete(schema.PostsTable)
      .where(eq(schema.PostsTable.id, id))
      .execute();
  } catch (error) {
    console.error(error);
  }
};

export const followUser = async (userEmail: string, followEmail: string) => {
  try {
    const userData = await getUserByEmail(userEmail);
    const followUserData = await getUserByEmail(followEmail);

    const newUserFollowingArray = userData?.following?.concat(followEmail);
    const newFollowersArray = followUserData?.followers?.concat(userEmail);

    const newUserData = await db.transaction(
      async (tx): Promise<UserData[]> => {
        const updatedUser = await tx
          .update(schema.UsersTable)
          .set({
            following: newUserFollowingArray,
          })
          .where(eq(schema.UsersTable.email, userEmail))
          .returning()
          .execute();

        await tx
          .update(schema.UsersTable)
          .set({
            followers: newFollowersArray,
          })
          .where(eq(schema.UsersTable.email, followEmail))
          .execute();

        return updatedUser;
      }
    );

    return newUserData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const unfollowUser = async (userEmail: string, followEmail: string) => {
  try {
    const userData = await getUserByEmail(userEmail);
    const followUserData = await getUserByEmail(followEmail);

    const newUserFollowingArray = userData?.following?.filter(
      (email: string) => email !== followEmail
    );
    const newFollowersArray = followUserData?.followers?.filter(
      (email: string) => email !== userEmail
    );

    const newUserData = await db.transaction(
      async (tx): Promise<UserData[]> => {
        const updatedUser = await tx
          .update(schema.UsersTable)
          .set({
            following: newUserFollowingArray,
          })
          .where(eq(schema.UsersTable.email, userEmail))
          .returning()
          .execute();

        await tx
          .update(schema.UsersTable)
          .set({
            followers: newFollowersArray,
          })
          .where(eq(schema.UsersTable.email, followEmail))
          .execute();

        return updatedUser;
      }
    );
    return newUserData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const ToggleLike = async (postId: number, userEmail: string) => {
  try {
    // check if this user email already likes this post
    const result = await db
      .select({ id: schema.LikesTable.id })
      .from(schema.LikesTable)
      .where(
        and(
          eq(schema.LikesTable.postId, postId),
          eq(schema.LikesTable.userEmail, userEmail)
        )
      )
      .execute();

    if (result.length > 0) {
      await db
        .delete(schema.LikesTable)
        .where(eq(schema.LikesTable.id, result[0].id))
        .execute();
    } else {
      await db
        .insert(schema.LikesTable)
        .values({ postId, userEmail })
        .execute();
    }
  } catch (error) {
    console.error(error);
  }
};

// Helpers

const PostQuery = async (userEmails: string[]) => {
  return await db
    .select({
      id: schema.PostsTable.id,
      content: schema.PostsTable.content,
      createdAt: schema.PostsTable.createdAt,
      authorUsername: schema.UsersTable.name,
      authorEmail: schema.UsersTable.email,
      authorImage: schema.UsersTable.image,
      authorId: schema.UsersTable.id,
      likes: sql<string[]>`array_agg(${schema.LikesTable.userEmail})`.as(
        'likes'
      ),
    })
    .from(schema.PostsTable)
    .innerJoin(
      schema.UsersTable,
      eq(schema.PostsTable.user, schema.UsersTable.email)
    )
    .leftJoin(
      schema.LikesTable,
      eq(schema.PostsTable.id, schema.LikesTable.postId)
    )
    .where(inArray(schema.UsersTable.email, userEmails))
    .groupBy(
      schema.PostsTable.id,
      schema.UsersTable.email,
      schema.UsersTable.name,
      schema.UsersTable.image,
      schema.UsersTable.id,
      schema.PostsTable.createdAt
    );
};
