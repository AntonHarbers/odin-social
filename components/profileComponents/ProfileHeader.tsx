import { UserData } from "@/app/lib/types";
import Image from "next/image";

export default function ProfileHeader({ user }: { user: UserData }) {
    return (
        <div className="text-center items-center flex flex-col">
            <Image className='rounded-3xl' src={user.image} width={100} height={100} alt="profile" />
            <h1 className='text-2xl font-mono'>{user.name}</h1>
            <div className="flex gap-2">
                <h1 className='text-base'>Following: {user.following?.length || 0}</h1>
                <h1 className='text-base'>Followers: {user.followers?.length || 0}</h1>
            </div>
        </div>
    )
}
