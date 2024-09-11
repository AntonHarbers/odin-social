"use client"

import { Button } from '@/components/ui/button'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getUserDataById } from '@/drizzle/db'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type slug = {

    id: string
}

export default function UserProfile({ params }: { params: slug }) {

    const { userData } = useGlobalContext() as any


    console.log(userData)
    const [userPostsData, setUserPostsData] = useState([] as any)

    useEffect(() => {
        const fetchUserDataById = async () => {
            const res = await getUserDataById(parseInt(params.id))

            if (!res) return
            setUserPostsData(res)
            console.log(res)
        }

        fetchUserDataById()
    }, [params.id])

    // get user profile information based on the users id

    if (userData.length === 0 || !userPostsData.user || !userPostsData.posts) return <div>Loading...</div>
    return (
        <div>
            <div className="text-center items-center flex flex-col">
                {userPostsData.user.image && <Image className='rounded-3xl' src={userPostsData.user.image} width={100} height={100} alt="profile" />}

                <h1 className='text-2xl font-mono'>{userPostsData.user.name}</h1>
                <div className="flex gap-2">
                    <h1 className='text-base'>Following: {userPostsData.user.following?.length || 0}</h1>

                    <h1 className='text-base'>Followers: {userPostsData.user.followers?.length || 0}</h1>
                </div>

                {userData.following.includes(userPostsData.user.email) ? <Button>Unfollow</Button> : <Button>Follow</Button>}
            </div>
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {userPostsData.posts.sort((a: { createdAt: Date }, b: { createdAt: Date }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post: any) => {
                    return (
                        <div key={post.id} className="p-2 border-slate-200 border m-1 w-80 flex flex-col rounded-md h-auto ">
                            <div className="w-full text-center border-b border-b-slate-200 p-2 mb-2">{userPostsData.user.name}</div>
                            <div className=" p-1">
                                {post.content}
                            </div>
                            <div className="text-slate-500 w-full text-end  text-xs">
                                {new Date(post.createdAt).toDateString()}

                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
