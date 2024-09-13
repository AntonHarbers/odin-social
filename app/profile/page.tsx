"use client"

import NewPostForm from '@/components/Global/NewPostForm'
import PostListItem from '@/components/Global/PostListItem'
import ProfileHeader from '@/components/profileComponents/ProfileHeader'
import { useGlobalContext } from '@/context/GlobalProvider'
import { sortedPostList } from '../lib/sortedPostList'
import { Post, UserData } from '../lib/types'

export default function Profile() {
    const { userData, userPosts } = useGlobalContext() as { userData: UserData, userPosts: Post[] };
    if (!userData || !userPosts) return null

    return (
        <div>
            <ProfileHeader user={userData} />
            <NewPostForm />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {sortedPostList(userPosts).map((post: Post) => {
                    return (
                        <PostListItem key={post.id} post={post} isSessionUser />
                    )
                })}
            </div>
        </div>
    )
}
