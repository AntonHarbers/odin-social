'use server';

import '@/drizzle/envConfig';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

const db = drizzle(sql, { schema });

export const getUsers = async () => {
  return db.query.UsersTable.findMany();
};

export const createUser = async (name: string, email: string) => {
  return db.insert(schema.UsersTable).values({ name, email }).returning();
};
