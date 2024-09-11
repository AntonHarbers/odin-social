"use client"

import NewPostForm from '@/components/NewPostForm'
import { useGlobalContext } from '@/context/GlobalProvider'
import { deletePost, getUserByEmail, getUserPosts } from '@/drizzle/db'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'


export default function Profile() {
    const { data: session } = useSession()
    const { userData } = useGlobalContext() as any
    const { userPosts, setUserPosts } = useGlobalContext() as any
    const [isLoading, setIsLoading] = useState(true)

    const handleDeletePost = async (id: number) => {
        if (!session) return
        if (!session.user?.email) return
        await deletePost(id)
        const postData = await getUserPosts(session.user?.email)
        setUserPosts(postData)
    }


    return (
        <div>
            <div className="text-center items-center flex flex-col">
                {isLoading && <Skeleton />}
                {session?.user?.image && <Image className='rounded-3xl' src={session?.user?.image} width={100} height={100} alt="profile" />}

                <h1 className='text-2xl font-mono'>{session?.user?.name}</h1>
                <div className="flex gap-2">
                    <h1 className='text-base'>Following: {userData.following?.length || 0}</h1>

                    <h1 className='text-base'>Followers: {userData.followers?.length || 0}</h1>
                </div>

            </div>
            <NewPostForm />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {userPosts.sort((a: any, b: any) => new Date(b.posts.createdAt).getTime() - new Date(a.posts.createdAt).getTime()).map((post: any) => {
                    return (
                        <div key={post.posts.id} className="p-2 border-slate-200 border m-1 w-80 flex flex-col rounded-md h-auto ">
                            <div className="w-full text-center border-b border-b-slate-200 p-2 mb-2">{post.users.name}</div>
                            <div className=" p-1">
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
        </div>
    )
}
