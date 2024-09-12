"use client"

import NewPostForm from '@/components/Global/NewPostForm'
import Post from '@/components/Global/Post'
import ProfileHeader from '@/components/profileComponents/ProfileHeader'
import { useGlobalContext } from '@/context/GlobalProvider'
import { sortedPostList } from '../lib/sortedPostList'

export default function Profile() {
    const { userData, userPosts } = useGlobalContext() as any

    if (!userData || !userPosts) return null

    return (
        <div>
            <ProfileHeader image={userData.image} name={userData.name} followingLength={userData.following.length} followersLength={userData.followers.length} />
            <NewPostForm />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                {sortedPostList(userPosts).map((post: any) => {
                    return (
                        <Post key={post.posts.id} post={post.posts} username={userData.name} isSessionUser />
                    )
                })}
            </div>
        </div>
    )
}
