"use client"

import { useGlobalContext } from "@/context/GlobalProvider";
import { getPostsOfFollowing } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { status } = useSession()
  const { userData } = useGlobalContext() as any

  const [posts, setPosts] = useState([] as any)


  useEffect(() => {

    const fetchData = async () => {
      const response = await getPostsOfFollowing([...userData.following, userData.email])
      console.log(response);

      setPosts(response)
    }
    if (!userData) return

    fetchData()

  }, [userData])

  // get all the posts of the user and any user they follow and display them




  if (status === 'loading' || !userData) return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Loading ...
    </main>
  )


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-10 gap-6">
      {posts.map((post: any) => (
        <div key={post.postId}>{post.postContent}</div>
      ))}
    </main>
  );
}
