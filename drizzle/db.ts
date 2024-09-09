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

export const createUser = async (name: string, email: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    console.log('creating user');

    db.insert(schema.UsersTable).values({ name, email }).returning();
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

  return db.query.PostsTable.findMany({
    where: (posts, { eq }) => eq(posts.user, email),
  });
};

export const deletePost = async (id: number) => {
  db.delete(schema.PostsTable).where(eq(schema.PostsTable.id, id)).execute();
};
