'use server';

import '@/drizzle/envConfig';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { eq, inArray } from 'drizzle-orm';
import { Post, UserData } from '../app/lib/types';
const db = drizzle(sql, { schema });

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

  const posts = await db
    .select({
      id: schema.PostsTable.id,
      content: schema.PostsTable.content,
      createdAt: schema.PostsTable.createdAt,
      authorUsername: schema.UsersTable.name,
      authorEmail: schema.UsersTable.email,
      authorImage: schema.UsersTable.image,
      authorId: schema.UsersTable.id,
    })
    .from(schema.PostsTable)
    .innerJoin(
      schema.UsersTable,
      eq(schema.PostsTable.user, schema.UsersTable.email)
    )
    .where(eq(schema.UsersTable.email, user.email));

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
    const posts = await db
      .select({
        id: schema.PostsTable.id,
        content: schema.PostsTable.content,
        createdAt: schema.PostsTable.createdAt,
        authorUsername: schema.UsersTable.name,
        authorEmail: schema.UsersTable.email,
        authorImage: schema.UsersTable.image,
        authorId: schema.UsersTable.id,
      })
      .from(schema.PostsTable)
      .innerJoin(
        schema.UsersTable,
        eq(schema.PostsTable.user, schema.UsersTable.email)
      )
      .where(inArray(schema.UsersTable.email, userEmails));

    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserPosts = async (email: string): Promise<Post[]> => {
  try {
    const posts = await db
      .select({
        id: schema.PostsTable.id,
        content: schema.PostsTable.content,
        createdAt: schema.PostsTable.createdAt,
        authorUsername: schema.UsersTable.name,
        authorEmail: schema.UsersTable.email,
        authorImage: schema.UsersTable.image,
        authorId: schema.UsersTable.id,
      })
      .from(schema.PostsTable)
      .innerJoin(
        schema.UsersTable,
        eq(schema.PostsTable.user, schema.UsersTable.email)
      )
      .where(eq(schema.UsersTable.email, email));

    return posts;
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
