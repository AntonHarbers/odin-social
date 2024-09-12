"use client"

import { sortedPostList } from '@/app/lib/sortedPostList'
import FollowButton from '@/components/Global/FollowButton'
import Post from '@/components/Global/Post'
import ProfileHeader from '@/components/profileComponents/ProfileHeader'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getUserDataById } from '@/drizzle/db'
import React, { useEffect, useState } from 'react'

export default function UserProfile({ params }: { params: { id: string } }) {

    const { userData } = useGlobalContext() as any
    const [userPostsData, setUserPostsData] = useState([] as any)


    useEffect(() => {
        const fetchUserDataById = async () => {
            const res = await getUserDataById(parseInt(params.id))
            if (!res) return
            setUserPostsData(res)
        }
        fetchUserDataById()

        if (!userData) return
        if (userData.id === parseInt(params.id)) window.location.href = '/profile'
    }, [params.id, userData])

    if (!userData || !userPostsData.user || !userPostsData.posts) return <div>Loading...</div>

    return (
        <div>
            <ProfileHeader image={userPostsData.user.image} name={userPostsData.user.name} followingLength={userPostsData.user.following?.length || 0} followersLength={userPostsData.user.followers?.length || 0} />
            <FollowButton user={userPostsData.user} styles='w-full flex justify-center my-4' />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {sortedPostList(userPostsData.posts).map((post: any) => {
                    return (
                        <Post key={post.id} username={userPostsData.user.name} post={post} />
                    )
                })}
            </div>
        </div>
    )
}