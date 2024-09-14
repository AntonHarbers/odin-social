"use client"

import { useGlobalContext } from "@/context/GlobalProvider";
import { getPostsOfFollowing } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Post, UserData } from "./lib/types";
import PostListItem from "@/components/Global/PostListItem";
import { sortedPostList } from "./lib/sortedPostList";

export default function Home() {
  const { status } = useSession()
  const { userData } = useGlobalContext() as { userData: UserData | null }

  const [posts, setPosts] = useState([] as Post[])


  useEffect(() => {
    if (!userData) return
    const fetchData = async () => {
      const response: Post[] = await getPostsOfFollowing([...userData.following ?? [], userData.email])
      console.log(response)
      setPosts(response)
    }

    fetchData()
  }, [userData])

  if (status === 'loading' || !userData) return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Loading ...
    </main>
  )

  return (
    <div className="flex max-h-[90vh] flex-col items-center justify-start p-10 gap-6 overflow-y-scroll">
      {sortedPostList(posts).map((post: Post) => (
        <PostListItem key={post.id} post={post} setPosts={(posts) => setPosts(posts ?? [])} />
      ))}
    </div>
  );
}
