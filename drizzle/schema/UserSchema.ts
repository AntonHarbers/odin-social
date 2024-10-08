import { sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    image: text('image').notNull(),
    // array of users we are following
    following: text('following')
      .references((): AnyPgColumn => UsersTable.email)
      .array()
      .default(sql`ARRAY[]::text[]`),
    followers: text('followers')
      .references((): AnyPgColumn => UsersTable.email)
      .array()
      .default(sql`ARRAY[]::text[]`),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('uniqueIdx').on(users.email),
    };
  }
);
