import { useState } from "react"

export default function UserSearchbar({ setShownUsers, users }: any) {

    const [searchInput, setSearchInput] = useState('')

    const handleSearch = () => {
        if (searchInput === '') return setShownUsers(users)
        const filteredUsers = users.filter((user: any) => user.name.match(new RegExp(searchInput, 'i')))
        setShownUsers(filteredUsers)
    }

    return (
        <div className='flex border rounded-md items-center'>
            <input onKeyUp={handleSearch} className='rounded-md w-full p-1 text-slate-800' type="text" placeholder='Enter Username...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>)
}
