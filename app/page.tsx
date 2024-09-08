"use client"

import { Button } from "@/components/ui/button";
import { createUser, getUsers } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TypewriterComponent from "typewriter-effect";
import { useForm, SubmitHandler } from "react-hook-form"

type Inpus = {
  post: string
}

export default function Home() {

  const { data: session, status } = useSession()

  const { register, handleSubmit, formState: { errors } } = useForm<Inpus>();

  const onSubmit: SubmitHandler<Inpus> = (data) => {
    console.log(data)

    "use server"

    if (!session) return
    if (!session.user?.email) return

    
  }

  useEffect(() => {
    if (!session) return
    if (session.user?.name && session.user?.email) {
      createUser(session.user?.name, session.user?.email)
    }


  }, [session])



  if (status === 'loading') return (<main className="flex min-h-screen flex-col items-center justify-between p-24">Loading ...
  </main>)
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-6">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl lg:flex">
        Welcome to Odin Social
      </div>
      <TypewriterComponent options={{ strings: ["Whats on your mind?!"], autoStart: true, loop: true, delay: 40 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text"  {...register("post", { required: true })} />
        <input type="submit" />
      </form>
      <div className="absolute right-5 top-5">
        {status === 'authenticated' && session.user?.name ? <Button><Link href={'/api/auth/signout'}>
          Sign Out
        </Link></Button>
          : <Link href={'/api/auth/signin'}>
            Sign In
          </Link>
        }
      </div>

    </main>
  );
}
