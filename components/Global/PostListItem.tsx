import { Post } from '@/app/lib/types'
import { useGlobalContext } from '@/context/GlobalProvider'
import { deletePost, getUserPosts } from '@/drizzle/db'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function PostListItem({ post, isSessionUser = false }: { post: Post, isSessionUser?: boolean }) {

    const { userData, setUserPosts } = useGlobalContext() as { userData: any; setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>; }

    const handleDeletePost = async (id: number) => {
        await deletePost(id)
        const postData: Post[] = await getUserPosts(userData.email)
        setUserPosts(postData)
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
            {
                isSessionUser &&
                <button onClick={() => handleDeletePost(post.id)} className="text-red-500 border-slate-200 rounded-md border m-2 mt-4">Delete Post</button>
            }
        </div>
    )
}
