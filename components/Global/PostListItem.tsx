import { Comment, Post, UserData } from '@/app/lib/types'
import { useGlobalContext } from '@/context/GlobalProvider'
import { deleteComment, deletePost, getCommentsOfPost, getPostsOfFollowing, getUserPosts, ToggleCommentLike, ToggleLike } from '@/drizzle/db'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import CommentForm from './CommentForm'

export default function PostListItem({ post, isSessionUser = false, setPosts = () => { }, userEmail = undefined }: { post: Post, isSessionUser?: boolean, setPosts?: (posts?: Post[]) => void, userEmail: string | undefined },) {

    const { userData, setUserPosts } = useGlobalContext() as { userData: UserData; setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>; }
    const [isLoading, setIsLoading] = useState(false)

    const [postComments, setPostCommnents] = useState([] as Comment[])
    // get all the comments on this post

    useEffect(() => {
        const fetchComments = async () => {
            const comments = await getCommentsOfPost(post.id)
            setPostCommnents(comments)
        }
        // get all the comments on this post
        fetchComments()
    }, [post])

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

    const HandleToggleCommentLike = async (id: number) => {
        setIsLoading(true)
        const res = await ToggleCommentLike(post.id, id, userData.email)
        setPostCommnents(res)
        setIsLoading(false)
    }

    const HandleDeleteComment = async (id: number) => {
        setIsLoading(true)
        await deleteComment(id)
        const comments = await getCommentsOfPost(post.id)
        console.log(comments)
        setPostCommnents(comments)
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
                <button disabled={isLoading} onClick={() => handleDeletePost(post.id)} className="text-red-500 border-slate-200 rounded-md border m-2 mt-4">Delete Post</button>
            }
            <div>
                <CommentForm postId={post.id} setPostComments={setPostCommnents} />
            </div>
            <div className='text-xl w-full text-center'>Comments:</div>
            {
                postComments.length ?
                    postComments.map((comment) => {
                        return <div key={comment.id}>
                            <div className=" w-full justify-center p-1 items-center flex flex-col border border-slate-200 rounded-md my-1 text-xs">
                                <div>
                                    By: {comment.authorUsername == userData.name ? "You" : comment.authorUsername}
                                </div>
                                <div className='p-2 text-lg'>
                                    {comment.content}
                                </div>
                                <div className='text-slate-500 text-xs p-1'>
                                    On: {new Date(comment.createdAt).toDateString()}
                                </div>
                                <div className='text-xl flex justify-between items-center m-2 w-full'>
                                    <Button disabled={isLoading} onClick={() => HandleToggleCommentLike(comment.id)} variant={'outline'}>{comment.likes && comment.likes.includes(userData.email) ? "Unlike" : "Like"}</Button>
                                    <div>
                                        {comment.likes ? comment.likes.length : 0} 👍
                                    </div>
                                </div>
                                {comment.authorEmail === userData.email && <div>
                                    <Button disabled={isLoading} variant={'destructive'} onClick={() => HandleDeleteComment(comment.id)}>Delete</Button>
                                </div>}

                            </div>
                        </div>
                    }) : <div className='text-slate-500 w-full text-center'>No Comments</div>

            }
        </div>
    )
}
