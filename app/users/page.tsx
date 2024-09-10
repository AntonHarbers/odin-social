"use client"

import { followUser, getUserByEmail, getUsers, unfollowUser } from '@/drizzle/db'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { useSession } from 'next-auth/react'

export default function Users() {
    const { data: session, status } = useSession()

    const [userData, setUserData] = useState({} as any)

    const [users, setUsers] = useState([] as any)
    const [shownUsers, setShownUsers] = useState([] as any)
    const [searchInput, setSearchInput] = useState('')

    const [loading, setLoading] = useState(true)



    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getUsers()
            setUsers(response)
            setShownUsers(response)
        }

        const fetchUserData = async () => {
            if (session?.user?.email) {
                const response = await getUserByEmail(session?.user?.email)
                setUserData(response)
                setLoading(false)
            }
        }
        fetchUsers()
        fetchUserData()
    }, [session])


    const handleSearch = () => {
        if (searchInput === '') return setShownUsers(users)
        // filter the users by the search input value with regex
        const filteredUsers = users.filter((user: any) => user.name.match(new RegExp(searchInput, 'i')))
        setShownUsers(filteredUsers)
    }

    const handleFollowBtnClick = async (followEmail: string) => {
        if (!session) return
        if (!session.user?.email) return
        setLoading(true)

        const response = await followUser(session?.user?.email, followEmail)
        console.log(response)

        setUserData(response[0])

        setLoading(false)
    }

    const handleUnfollowBtnClick = async (followEmail: string) => {
        if (!session) return
        if (!session.user?.email) return
        setLoading(true)
        const response = await unfollowUser(session?.user?.email, followEmail)
        console.log(response)
        setUserData(response[0])
        setLoading(false)
    }

    if (userData.following === undefined) return null

    return (
        <div className='flex flex-col items-center gap-5'>
            <div className='flex border rounded-md items-center'>
                <input onKeyUp={handleSearch} className='rounded-md w-full p-1' type="text" placeholder='Enter Username...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                {/* <Button onClick={handleSearch}>Search</Button> */}
            </div>
            <ul className='flex flex-col gap-2 '>
                {shownUsers.map((user: any) => (
                    <li key={user.id} className="border border-slate-400 p-4 rounded-md flex items-center gap-4 w-[50vw] min-w-72 justify-between">
                        <div className="flex items-center gap-4">
                            <Image src={user.image} alt={user.name} width={50} height={50} />
                            {user.name}
                        </div>
                        {(user.email !== session?.user?.email && !userData.following.includes(user.email)) && <div>
                            <Button disabled={loading} onClick={() => handleFollowBtnClick(user.email)} variant={'outline'}>Follow</Button>
                        </div>}

                        {userData.following.includes(user.email) && <div>
                            <Button disabled={loading} onClick={() => handleUnfollowBtnClick(user.email)} variant={'destructive'}>Unfollow</Button>
                        </div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}


// when we click follow button
// add user to following of followed
// add followed to followed of user