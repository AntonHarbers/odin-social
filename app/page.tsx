"use client"

import { Button } from "@/components/ui/button";
import { createPost, createUser, deletePost, getUserPosts, getUsers } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TypewriterComponent from "typewriter-effect";
import { useForm, SubmitHandler } from "react-hook-form"

type Inpus = {
  post: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<Inpus>();

  const [userPosts, setUserPosts] = useState([] as any[])

  const watchPost = watch("post", "")

  const onSubmit: SubmitHandler<Inpus> = async (data) => {

    if (!session) return
    if (!session.user?.email) return
    console.log('Submit')
    await createPost(data.post, session.user?.email)
    const postData = await getUserPosts(session.user?.email)
    setUserPosts(postData)
    reset()
  }

  const handleDeletePost = async (id: number) => {
    if (!session) return
    if (!session.user?.email) return
    await deletePost(id)
    const postData = await getUserPosts(session.user?.email)
    setUserPosts(postData)
  }

  useEffect(() => {
    const fetchPosts = async (email: string) => {
      const postData = await getUserPosts(email)
      console.log(postData)
      setUserPosts(postData)
    }

    if (!session) return
    if (session.user?.name && session.user?.email) {
      createUser(session.user?.name, session.user?.email)
      fetchPosts(session.user?.email)
    }



  }, [session])



  if (status === 'loading') return (<main className="flex min-h-screen flex-col items-center justify-between p-24">Loading ...
  </main>)
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-6">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl lg:flex">
        Welcome to Odin Social
      </div>
      {errors.post && <span className="text-red-500">Please enter a post</span>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 gap-2 relative">

        <textarea className="border border-slate-400 p-4 rounded-md resize-none" rows={4} cols={40} aria-invalid={errors.post ? "true" : "false"}  {...register("post", { required: true, maxLength: 100 },)} />
        <div className={`absolute right-5 bottom-12 ${watchPost.length > 100 ? "text-red-500" : "text-slate-500"}`}>{watchPost.length}/100</div>
        {watchPost.length === 0 && <div className="absolute left-6 top-6">
          <TypewriterComponent options={{ strings: ["Whats on your mind?!"], autoStart: true, loop: true, delay: 40 }} />
        </div>}


        <input className="bg-slate-600 text-white rounded-md" type="submit" value="Post" />
      </form>

      <div>
        {userPosts.sort((a, b) => new Date(b.posts.createdAt).getTime() - new Date(a.posts.createdAt).getTime()).map((post: any) => {
          return (
            <div key={post.posts.id} className="p-2 border-slate-200 border m-1 w-80 flex flex-col rounded-md h-auto ">
              <div className="w-full text-center border-b border-b-slate-200 p-2 mb-2">{post.users.name}</div>
              <div className="text-slate-800 p-1">
                {post.posts.content}
              </div>
              <div className="text-slate-500 w-full text-end  text-xs">
                {new Date(post.posts.createdAt).toDateString()}

              </div>
              <button onClick={() => handleDeletePost(post.posts.id)} className="text-red-500 border-slate-200 rounded-md border m-2 mt-4">Delete Post</button>
            </div>
          )
        })}
      </div>
      <div className="absolute right-5 top-5">
        {status === 'authenticated' && session.user?.name ? <Button><Link href={'/api/auth/signout'}>
          Sign Out
        </Link></Button>
          : <Link href={'/api/auth/signin'}>
            Sign In
          </Link>
        }
      </div>

    </main>
  );
}
