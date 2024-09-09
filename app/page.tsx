"use client"

import { createUser } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Home() {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (!session) return
    if (session.user?.name && session.user?.email) {
      createUser(session.user?.name, session.user?.email, session.user?.image!)
    }
  }, [session])


  if (status === 'loading') return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Loading ...
    </main>
  )


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-10 gap-6">
      Welcome
    </main>
  );
}
