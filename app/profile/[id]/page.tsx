"use client"
import { sortedPostList } from '@/app/lib/sortedPostList'
import FollowButton from '@/components/Global/FollowButton'
import PostListItem from '@/components/Global/PostListItem'
import ProfileHeader from '@/components/profileComponents/ProfileHeader'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getUserDataById } from '@/drizzle/db'
import React, { useEffect, useState } from 'react'
import { Post, UserData } from '@/app/lib/types'

export default function UserProfile({ params }: { params: { id: string } }) {

    const { userData } = useGlobalContext() as { userData: UserData | null }
    const [userPostsData, setUserPostsData] = useState({ user: null, posts: [] } as { user: UserData | null; posts: Post[] })

    useEffect(() => {
        const fetchUserDataById = async () => {
            const res: { user: UserData | null; posts: Post[] } = await getUserDataById(parseInt(params.id))
            setUserPostsData(res)
        }
        fetchUserDataById()

        if (!userData) return
        if (userData.id === parseInt(params.id)) window.location.href = '/profile'
    }, [params.id, userData])

    if (!userData || !userPostsData.user || !userPostsData.posts) return <div>Loading...</div>

    return (
        <div>
            <ProfileHeader user={userPostsData.user} />
            <FollowButton user={userPostsData.user} styles='w-full flex justify-center my-4' />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {sortedPostList(userPostsData.posts).map((post: Post) => {
                    return (
                        <PostListItem key={post.id} post={post} />
                    )
                })}
            </div>
        </div>
    )
}