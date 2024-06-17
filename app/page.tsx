"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {

  const { data: session, status } = useSession()

  if (status === 'loading') return <main className="flex min-h-screen flex-col items-center justify-between p-24">Loading ...
  </main>
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl lg:flex">
        Welcome to Odin Social!
      </div>
      <div className="absolute right-5 top-5">
        {status === 'authenticated' && session.user?.name ? <Link href={'/api/auth/signout'}>
          Sign Out
        </Link>
          : <Link href={'/api/auth/signin'}>
            Sign In
          </Link>
        }
      </div>

    </main>
  );
}
