import React, { useState } from 'react'
import { Button } from '../ui/button'
import { createComment } from '@/drizzle/db'
import { useGlobalContext } from '@/context/GlobalProvider'
import { UserData } from '@/app/lib/types'

export default function CommentForm({ postId }: { postId: number }) {
    const { userData } = useGlobalContext() as { userData: UserData }
    const [isCommenting, setIsCommenting] = useState(false as boolean)
    const [comment, setComment] = useState('' as string)

    const toggleCommenting = () => {
        setIsCommenting(!isCommenting)
    }

    const HandlePostComment = (e: any) => {
        e.preventDefault()
        createComment(comment, userData.email, postId)
        // set comment db call and refresh the comments under this post
        setComment('')
        console.log(comment)
    }
    return (
        <div className='w-full flex flex-col gap-y-2 justify-center items-center my-2'>

            <Button onClick={toggleCommenting}>Comment</Button>
            {isCommenting &&
                <form className='w-full flex flex-col items-center justify-center gap-y-2'>
                    <textarea name="" id="" onChange={(e) => setComment(e.target.value)} value={comment} className='w-full text-slate-800 border border-slate-200 p-2 rounded-md' />
                    <Button onClick={HandlePostComment} >Post</Button>
                </form>}
        </div>
    )
}
