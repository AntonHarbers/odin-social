import {
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
    user: text('user').references(() => UsersTable.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (posts) => {
    return {
      uniqueIdx: uniqueIndex('uniqueIdx').on(posts.user),
    };
  }
);
