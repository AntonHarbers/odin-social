import { Comment, UserData } from '@/app/lib/types'
import { useGlobalContext } from '@/context/GlobalProvider'
import { deleteComment, getCommentsOfPost, ToggleCommentLike } from '@/drizzle/db/commentDb'
import React, { useState } from 'react'
import { Button } from '../ui/button'

export default function CommentListItem({ comment, postId, setPostComments }: { comment: Comment, postId: number, setPostComments: React.Dispatch<React.SetStateAction<Comment[]>> }) {

    const { userData } = useGlobalContext() as { userData: UserData }
    const [isLoading, setIsLoading] = useState(false)

    const HandleToggleCommentLike = async (id: number) => {
        setIsLoading(true)
        const res = await ToggleCommentLike(postId, id, userData.email)
        setPostComments(res)
        setIsLoading(false)
    }

    const HandleDeleteComment = async (id: number) => {
        setIsLoading(true)
        await deleteComment(id)
        const comments = await getCommentsOfPost(postId)
        setPostComments(comments)
        setIsLoading(false)
    }

    return (
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
    )
}
