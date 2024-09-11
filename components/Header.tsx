"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'
import { useGlobalContext } from '@/context/GlobalProvider'



export default function Header() {

    const { data: session, status } = useSession()
    const { userData } = useGlobalContext() as any



    return (
        <div className="flex items-center justify-between font-mono text-2xl py-4 px-10">
            <Link href={'/'} className="z-10 font-mono text-3xl font-bold">
                Odin Social
            </Link>
            <div className="">
                {status === 'authenticated' && session.user?.name ?
                    <div className="flex gap-4 items-center">
                        <nav className='flex gap-4'>
                            {/* Home will be the feed and where you can post */}
                            <Link href={'/'}>
                                Home
                            </Link>
                            {/* Profile will be just your feed and your user info and you can post */}
                            <Link href={'/profile'}>
                                Profile
                            </Link>
                            {/* List of users */}
                            <Link href={'/users'}>
                                Users
                            </Link>
                        </nav>
                        <ThemeToggle />
                        <Button>
                            <Link href={'/api/auth/signout'}>
                                Sign Out
                            </Link>
                        </Button>
                    </div>

                    :
                    <Link href={'/api/auth/signin'}>
                        Sign In
                    </Link>
                }
            </div></div>
    )
}
