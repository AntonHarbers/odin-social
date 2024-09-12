import { useGlobalContext } from "@/context/GlobalProvider"
import { followUser, unfollowUser } from "@/drizzle/db"
import { useState } from "react"
import { Button } from "../ui/button"

export default function FollowButton({ user, styles = '' }: { user: any, styles?: string }) {

    const { userData, setUserData } = useGlobalContext() as any
    const [loading, setLoading] = useState(false)

    const handleFollowBtnClick = async (followEmail: string) => {
        setLoading(true)
        const response = await followUser(userData.email, followEmail)
        setUserData(response[0])
        setLoading(false)
    }

    const handleUnfollowBtnClick = async (followEmail: string) => {
        setLoading(true)
        const response = await unfollowUser(userData.email, followEmail)
        setUserData(response[0])
        setLoading(false)
    }
    return (
        <div className={styles}> {(!userData.following.includes(user.email)) ? <div>
            <Button disabled={loading} onClick={() => handleFollowBtnClick(user.email)} variant={'outline'}>Follow</Button>
        </div> : <Button disabled={loading} onClick={() => handleUnfollowBtnClick(user.email)} variant={'destructive'}>Unfollow</Button>
        }</div>
    )
}
