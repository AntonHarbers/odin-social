import { sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { UsersTable } from './UserSchema';
import { PostsTable } from './PostSchema';

export const CommentsTable = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    author: text('user').references(() => UsersTable.email, {
      onDelete: 'cascade',
    }),
    postId: integer('postId').references(() => PostsTable.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    // array of users who liked this comment
    likes: text('likes')
      .references((): AnyPgColumn => UsersTable.email, {
        onDelete: 'cascade',
      })
      .array()
      .default(sql`ARRAY[]::text[]`),
  },
  (comments) => {
    return {};
  }
);
