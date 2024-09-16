import { Post, UserData } from '@/app/lib/types'
import { useGlobalContext } from '@/context/GlobalProvider'
import { deletePost, getPostsOfFollowing, getUserPosts, ToggleLike } from '@/drizzle/db/postDb'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import PostCommentsList from '../commentComponents/PostCommentsList'

export default function PostListItem({ post, isSessionUser = false, setPosts = () => { }, userEmail = undefined }: { post: Post, isSessionUser?: boolean, setPosts?: (posts?: Post[]) => void, userEmail: string | undefined },) {

    const { userData, setUserPosts } = useGlobalContext() as { userData: UserData; setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>; }
    const [isLoading, setIsLoading] = useState(false)

    const handleDeletePost = async (id: number) => {
        await deletePost(id)
        const postData: Post[] = await getUserPosts(userData.email)
        setUserPosts(postData)
    }

    const HandleToggleLike = async (id: number) => {
        setIsLoading(true)
        const res = await ToggleLike(id, userData.email)
        if (isSessionUser) {
            const postData: Post[] = await getUserPosts(userData.email)
            setUserPosts(postData)
        } else {
            if (userEmail) {
                const postData: Post[] = await getPostsOfFollowing([userEmail])
                setPosts(postData)

            } else {
                const response: Post[] = await getPostsOfFollowing([...userData.following ?? [], userData.email])
                setPosts(response)
            }
        }
        setIsLoading(false)
    }

    return (
        <div className="p-2 border-slate-200 border m-1 w-80 flex flex-col rounded-md h-auto ">
            <Link href={`/profile/${post.authorId}`} className="w-full text-center border-b border-b-slate-200 p-2 mb-2 flex justify-start gap-x-4 items-center">
                <Image src={post.authorImage} alt={post.authorUsername} width={40} height={40} className="rounded-md" />
                {post.authorUsername}
            </Link>
            <div className=" p-1 text-center">
                {post.content}
            </div>
            <div className="text-slate-500 w-full text-end  text-xs">
                {new Date(post.createdAt).toDateString()}

            </div>
            <div className='text-xl flex justify-between items-center m-2'>
                <Button disabled={isLoading} onClick={() => HandleToggleLike(post.id)} variant={'outline'}>{post.likes.includes(userData.email) ? "Unlike" : "Like"}</Button>
                <div>
                    {post.likes[0] ? post.likes.length : 0} 👍
                </div>
            </div>
            {
                isSessionUser &&
                <Button disabled={isLoading} onClick={() => handleDeletePost(post.id)} className="text-red-500 border-slate-200 rounded-md border m-2 mt-4">Delete Post</Button>
            }
            <PostCommentsList postId={post.id} />
        </div>
    )
}
