import { useGlobalContext } from "@/context/GlobalProvider"
import { followUser, unfollowUser } from "@/drizzle/db"
import { useState } from "react"
import { Button } from "../ui/button"
import { UserData } from "@/app/lib/types"

export default function FollowButton({ user, styles = '' }: { user: UserData, styles?: string }) {

    const { userData, setUserData } = useGlobalContext() as any
    const [loading, setLoading] = useState(false)

    const handleFollowBtnClick = async (followEmail: string) => {
        setLoading(true)
        const response: UserData[] | null = await followUser(userData.email, followEmail)
        if (!response) return
        setUserData(response[0])
        setLoading(false)
    }

    const handleUnfollowBtnClick = async (followEmail: string) => {
        setLoading(true)
        const response: UserData[] | null = await unfollowUser(userData.email, followEmail)
        if (!response) return
        setUserData(response[0])
        setLoading(false)
    }
    return (
        <div className={styles}>
            {(!userData.following.includes(user.email))
                ?
                <div>
                    <Button disabled={loading} onClick={() => handleFollowBtnClick(user.email)} variant={'outline'}>
                        Follow
                    </Button>
                </div>
                :
                <Button disabled={loading} onClick={() => handleUnfollowBtnClick(user.email)} variant={'destructive'}>
                    Unfollow
                </Button>
            }
        </div>
    )
}
