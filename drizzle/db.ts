'use server';

import '@/drizzle/envConfig';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

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
  console.log(user);
  if (!user) {
    db.insert(schema.UsersTable).values({ name, email }).returning();
  }
};

export const createPost = async (post: string, userEmail: string) => {
  db.insert(schema.PostsTable).values({ content, user }).returning();
};
