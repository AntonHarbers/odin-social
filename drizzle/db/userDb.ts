'use server';

import { Post, UserData } from '@/app/lib/types';
import { PostQuery } from './helpers';
import { eq } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import { UsersTable } from '../schema/UserSchema';

const db = drizzle(sqlVercel, { schema: { UsersTable } });

export const createUser = async (
  name: string,
  email: string,
  image: string
) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('creating user');
      db.insert(UsersTable).values({ name, email, image }).execute();
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (): Promise<UserData[]> => {
  try {
    const users = await db.query.UsersTable.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  try {
    const user = await db.query.UsersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserDataById = async (
  id: number
): Promise<{ user: any; posts: Post[] }> => {
  const user = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  }).execute();

  if (!user) return { user: null, posts: [] };

  const posts = await PostQuery([user.email]);

  return { user, posts };
};

export const followUser = async (userEmail: string, followEmail: string) => {
  try {
    const userData = await getUserByEmail(userEmail);
    const followUserData = await getUserByEmail(followEmail);

    const newUserFollowingArray = userData?.following?.concat(followEmail);
    const newFollowersArray = followUserData?.followers?.concat(userEmail);

    const newUserData = await db.transaction(
      async (tx): Promise<UserData[]> => {
        const updatedUser = await tx
          .update(UsersTable)
          .set({
            following: newUserFollowingArray,
          })
          .where(eq(UsersTable.email, userEmail))
          .returning()
          .execute();

        await tx
          .update(UsersTable)
          .set({
            followers: newFollowersArray,
          })
          .where(eq(UsersTable.email, followEmail))
          .execute();

        return updatedUser;
      }
    );

    return newUserData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const unfollowUser = async (userEmail: string, followEmail: string) => {
  try {
    const userData = await getUserByEmail(userEmail);
    const followUserData = await getUserByEmail(followEmail);

    const newUserFollowingArray = userData?.following?.filter(
      (email: string) => email !== followEmail
    );
    const newFollowersArray = followUserData?.followers?.filter(
      (email: string) => email !== userEmail
    );

    const newUserData = await db.transaction(
      async (tx): Promise<UserData[]> => {
        const updatedUser = await tx
          .update(UsersTable)
          .set({
            following: newUserFollowingArray,
          })
          .where(eq(UsersTable.email, userEmail))
          .returning()
          .execute();

        await tx
          .update(UsersTable)
          .set({
            followers: newFollowersArray,
          })
          .where(eq(UsersTable.email, followEmail))
          .execute();

        return updatedUser;
      }
    );
    return newUserData;
  } catch (error) {
    console.error(error);
    return null;
  }
};
