'use server';

import '@/drizzle/envConfig';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const db = drizzle(sql, { schema });

export const getUsers = async () => {
  return db.query.UsersTable.findMany();
};

export const getUserByEmail = async (email: string) => {
  return db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
};

export const getUserDataById = async (id: number) => {
  const user = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  }).execute();

  if (!user) return;

  const posts = await db.query.PostsTable.findMany({
    where: (posts, { eq }) => eq(posts.user, user?.email),
  });

  return { user, posts };
};

export const createUser = async (
  name: string,
  email: string,
  image: string
) => {
  console.log('user');
  const user = await getUserByEmail(email);

  console.log(user);
  if (!user) {
    console.log('creating user');

    db.insert(schema.UsersTable)
      .values({ name, email, image })
      .returning()
      .execute();
  }
};

export const createPost = async (post: string, userEmail: string) => {
  console.log('ye');

  db.insert(schema.PostsTable)
    .values({ content: post, user: userEmail })
    .returning()
    .execute();
};

export const getUserPosts = async (email: string) => {
  return db
    .select()
    .from(schema.PostsTable)
    .innerJoin(
      schema.UsersTable,
      eq(schema.PostsTable.user, schema.UsersTable.email)
    )
    .where(eq(schema.UsersTable.email, email));
};

export const deletePost = async (id: number) => {
  db.delete(schema.PostsTable).where(eq(schema.PostsTable.id, id)).execute();
};

export const followUser = async (userEmail: string, followEmail: string) => {
  const userData = await getUserByEmail(userEmail);
  const followUserData = await getUserByEmail(followEmail);

  const newUserFollowingArray = userData?.following?.concat(followEmail);
  const newFollowersArray = followUserData?.followers?.concat(userEmail);

  const newUserData = db
    .update(schema.UsersTable)
    .set({
      following: newUserFollowingArray,
    })
    .where(eq(schema.UsersTable.email, userEmail))
    .returning()
    .execute();
  db.update(schema.UsersTable)
    .set({
      followers: newFollowersArray,
    })
    .where(eq(schema.UsersTable.email, followEmail))
    .execute();

  return newUserData;
};

export const unfollowUser = async (userEmail: string, followEmail: string) => {
  const userData = await getUserByEmail(userEmail);
  const followUserData = await getUserByEmail(followEmail);

  const newUserFollowingArray = userData?.following?.filter(
    (email: string) => email !== followEmail
  );
  const newFollowersArray = followUserData?.followers?.filter(
    (email: string) => email !== userEmail
  );

  const newUserData = db
    .update(schema.UsersTable)
    .set({
      following: newUserFollowingArray,
    })
    .where(eq(schema.UsersTable.email, userEmail))
    .returning()
    .execute();
  db.update(schema.UsersTable)
    .set({
      followers: newFollowersArray,
    })
    .where(eq(schema.UsersTable.email, followEmail))
    .execute();

  return newUserData;
};
