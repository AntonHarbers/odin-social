"use client"
import { getUsers } from '@/drizzle/db'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useGlobalContext } from '@/context/GlobalProvider'
import FollowButton from '@/components/Global/FollowButton'
import UserSearchbar from '@/components/userListComponents/UserSearchbar'

export default function Users() {
    const { userData } = useGlobalContext() as any
    const [users, setUsers] = useState([] as any)
    const [shownUsers, setShownUsers] = useState([] as any)

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getUsers()
            setUsers(response)
            setShownUsers(response)
        }
        fetchUsers()
    }, [])

    if (!userData) return null

    return (
        <div className='flex flex-col items-center gap-5'>
            <UserSearchbar setShownUsers={setShownUsers} users={users} />
            <ul className='flex flex-col gap-2 '>
                {shownUsers.map((user: any) => {
                    if (user.email != userData.email) return (
                        <li key={user.id} className="border border-slate-400 p-4 rounded-md flex items-center gap-4 w-[50vw] min-w-72 justify-between">
                            <div className="flex items-center gap-4">
                                <Image src={user.image} alt={user.name} width={50} height={50} />
                                <Link href={`/profile/${user.id}`}>{user.name} </Link>
                            </div>
                            <FollowButton user={user} />
                        </li>
                    )
                })}
            </ul>
        </div >
    )
}