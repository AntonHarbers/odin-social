import { sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  integer,
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

export const PostsTable = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    user: text('user').references(() => UsersTable.email, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (posts) => {
    return {};
  }
);

export const LikesTable = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    userEmail: text('userEmail').references(() => UsersTable.email, {
      onDelete: 'cascade',
    }),
    postId: integer('postId').references(() => PostsTable.id, {
      onDelete: 'cascade',
    }),
  },
  (likes) => {
    return {};
  }
);

export const CommentsTable = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    author: text('user').references(() => UsersTable.email),
    postId: integer('postId').references(() => PostsTable.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (comments) => {
    return {};
  }
);
