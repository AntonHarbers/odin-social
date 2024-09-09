"use client"

import { getUsers } from '@/drizzle/db'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function Users() {

    const [users, setUsers] = useState([] as any)

    useEffect(() => {

        const fetchUsers = async () => {
            const response = await getUsers()
            console.log(response)
            setUsers(response)
        }
        fetchUsers()

    }, [])


    return (
        <div className='flex flex-col items-center gap-5'>
            <h1>Users</h1>
            <ul className='flex flex-col gap-2'>
                {users.map((user: any) => (
                    <li key={user.id} className="border border-slate-400 p-4 rounded-md flex items-center gap-4">
                        <Image src={user.image} alt={user.name} width={50} height={50} />
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
