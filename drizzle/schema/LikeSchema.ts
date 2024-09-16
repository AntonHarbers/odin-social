import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { UsersTable } from './UserSchema';
import { PostsTable } from './PostSchema';

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
