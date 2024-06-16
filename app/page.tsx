"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const { data: session, status } = useSession()

  if (status === 'loading') return <main className="flex min-h-screen flex-col items-center justify-between p-24">Loading ...
  </main>
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {status === 'authenticated' && session.user?.name ? <Link href={'/api/auth/signout'}>
        Sign Out
      </Link>
        : <Link href={'/api/auth/signin'}>
          Sign In
        </Link>
      }
    </main>
  );
}
