import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { UsersTable } from './UserSchema';

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
