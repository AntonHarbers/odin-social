import Image from "next/image";

export default function ProfileHeader({ image, name, followingLength, followersLength }: { image: string, name: string, followingLength: number, followersLength: number }) {
    return (
        <div className="text-center items-center flex flex-col">
            <Image className='rounded-3xl' src={image} width={100} height={100} alt="profile" />
            <h1 className='text-2xl font-mono'>{name}</h1>
            <div className="flex gap-2">
                <h1 className='text-base'>Following: {followingLength}</h1>
                <h1 className='text-base'>Followers: {followersLength}</h1>
            </div>
        </div>
    )
}
