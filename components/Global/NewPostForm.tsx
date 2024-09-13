"use client"

import { createPost, getUserPosts } from '@/drizzle/db';
import { useSession } from 'next-auth/react';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import TypewriterComponent from 'typewriter-effect';
import { Button } from '../ui/button';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Post } from '@/app/lib/types';

export default function NewPostForm() {

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<{ post: string }>();
    const { data: session } = useSession()
    const { setUserPosts } = useGlobalContext() as { setUserPosts: React.Dispatch<React.SetStateAction<Post[]>> }
    const watchPost = watch("post", "")


    const onSubmit: SubmitHandler<{ post: string }> = async (data) => {
        if (!session) return
        if (!session.user?.email) return

        await createPost(data.post, session.user?.email)
        const postData: Post[] = await getUserPosts(session.user?.email)
        setUserPosts(postData)
        reset()
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 gap-2 relative  max-w-[400px] mx-auto">

            <textarea className="border border-slate-400 p-4 rounded-md resize-none" rows={4} cols={40} aria-invalid={errors.post ? "true" : "false"}  {...register("post", { required: true, maxLength: 100 },)} />
            <div className={`absolute right-5 bottom-12 ${watchPost.length > 100 ? "text-red-500" : "text-slate-500"}`}>{watchPost.length}/100</div>
            {watchPost.length === 0 && <div className="absolute left-6 top-6">
                <TypewriterComponent options={{ strings: ["Whats on your mind?!"], autoStart: true, loop: true, delay: 40 }} />
            </div>}

            <Button>Post</Button>
            {errors.post && <span className="text-red-500">Please enter a post</span>}

        </form>
    )
}
