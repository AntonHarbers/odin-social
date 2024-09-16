import { Comment } from '@/app/lib/types';
import React, { useEffect, useState } from 'react'
import CommentForm from './CommentForm';
import CommentListItem from './CommentListItem';
import { getCommentsOfPost } from '@/drizzle/db/commentDb';

export default function PostCommentsList({ postId }: { postId: number }) {

    const [postComments, setPostComments] = useState([] as Comment[])

    useEffect(() => {
        const fetchComments = async () => {
            const comments: Comment[] = await getCommentsOfPost(postId)
            setPostComments(comments)
        }
        fetchComments()
    }, [postId, setPostComments])

    return (
        <div>
            <CommentForm postId={postId} setPostComments={setPostComments} />
            <div className='text-xl w-full text-center'>Comments:</div>
            {
                postComments.length
                    ?
                    postComments.map((comment) => {
                        return <CommentListItem key={comment.id} postId={postId} comment={comment} setPostComments={setPostComments} />
                    })
                    :
                    <div className='text-slate-500 w-full text-center'>
                        No Comments
                    </div>
            }
        </div>
    )
}
