import { useGlobalContext } from '@/context/GlobalProvider'
import { deletePost, getUserPosts } from '@/drizzle/db'
import React from 'react'

export default function Post({ post, username, isSessionUser = false }: any) {

    const { userData, setUserPosts } = useGlobalContext() as any

    const handleDeletePost = async (id: number) => {
        await deletePost(id)
        const postData = await getUserPosts(userData.email)
        setUserPosts(postData)
    }

    return (
        <div className="p-2 border-slate-200 border m-1 w-80 flex flex-col rounded-md h-auto ">
            <div className="w-full text-center border-b border-b-slate-200 p-2 mb-2">{username}</div>
            <div className=" p-1">
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
