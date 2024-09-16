'use server';

import { desc, eq, sql } from 'drizzle-orm';
import { Comment } from '@/app/lib/types';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import { CommentsTable } from '../schema/CommentSchema';
import { UsersTable } from '../schema/UserSchema';

const db = drizzle(sqlVercel, { schema: { CommentsTable, UsersTable } });

export const createComment = async (
  comment: string,
  userEmail: string,
  postId: number
): Promise<Comment[]> => {
  try {
    await db
      .insert(CommentsTable)
      .values({ content: comment, author: userEmail, postId: postId })
      .returning()
      .execute();
    const result = await getCommentsOfPost(postId);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteComment = async (id: number) => {
  try {
    await db.delete(CommentsTable).where(eq(CommentsTable.id, id)).execute();
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsOfPost = async (postId: number): Promise<Comment[]> => {
  try {
    const comments = await db
      .select({
        id: CommentsTable.id,
        content: CommentsTable.content,
        createdAt: CommentsTable.createdAt,
        authorUsername: UsersTable.name,
        authorEmail: UsersTable.email,
        authorImage: UsersTable.image,
        authorId: UsersTable.id,
        likes: CommentsTable.likes,
      })
      .from(CommentsTable)
      .innerJoin(UsersTable, eq(UsersTable.email, CommentsTable.author))
      .where(eq(CommentsTable.postId, postId))
      .orderBy(desc(CommentsTable.createdAt))
      .execute();
    return comments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ToggleCommentLike = async (
  postId: number,
  commentId: number,
  userEmail: string
): Promise<Comment[]> => {
  try {
    await db
      .update(CommentsTable)
      .set({
        likes: sql`
          CASE 
            WHEN ${userEmail} = ANY(${CommentsTable.likes}) THEN 
            array_remove(${CommentsTable.likes}, ${userEmail})
            ELSE array_append(${CommentsTable.likes}, ${userEmail})
            END
        `,
      })
      .where(eq(CommentsTable.id, commentId))
      .execute();

    return await getCommentsOfPost(postId);
  } catch (error) {
    console.error(error);
    return [];
  }
};
