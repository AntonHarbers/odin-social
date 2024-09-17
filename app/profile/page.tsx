"use client"

import NewPostForm from '@/components/Global/NewPostForm'
import PostListItem from '@/components/Global/PostListItem'
import ProfileHeader from '@/components/profileComponents/ProfileHeader'
import { useGlobalContext } from '@/context/GlobalProvider'
import { sortedPostList } from '../lib/sortedPostList'
import { Post, UserData } from '../lib/types'

export default function Profile() {
    const { userData, setUserData, userPosts } = useGlobalContext() as { userData: UserData, setUserData: React.Dispatch<React.SetStateAction<UserData>>, userPosts: Post[] };

    if (!userData || !userPosts) return null

    return (
        <div>
            <ProfileHeader user={userData} setUserData={setUserData} isSessionUser />
            <NewPostForm />
            <div className='flex flex-col  items-center gap-2 overflow-scroll h-[50vh]'>
                <h1 className='text-3xl font-bold m-2 underline'>Your Posts</h1>
                {sortedPostList(userPosts).length === 0 && <p>No posts yet</p>}
                {sortedPostList(userPosts).map((post: Post) => {
                    return (
                        <PostListItem key={post.id} post={post} isSessionUser userEmail={undefined} />
                    )
                })}
            </div>
        </div>
    )
}
