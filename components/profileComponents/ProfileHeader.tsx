"use client"

import { UserData } from "@/app/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { updateUserImageUrl } from "@/drizzle/db/userDb";
import { EditIcon } from "../Global/Icons/EditIcon";
import { UploadButton, UploadDropzone } from "@/lib/uploadThing/utils";
import { useState } from "react";

export default function ProfileHeader({ user, isSessionUser = false, setUserData = () => { } }: { user: UserData, isSessionUser?: boolean, setUserData?: React.Dispatch<React.SetStateAction<UserData>> }) {

    const [isEditing, setIsEditing] = useState(false)

    const HandleEditBtnClick = async () => {
        if (!isSessionUser) return
        const res = await updateUserImageUrl('url', user)
        setUserData(res)
    }

    return (
        <div className="text-center items-center flex flex-col">
            {isEditing
                ?
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        alert("Upload Completed");
                    }}
                    onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                    }}
                />
                :
                <div className="relative">
                    <Image className='rounded-3xl' src={user.image} width={100} height={100} alt="profile" />
                    {isSessionUser &&
                        <Button className="absolute top-0 right-0 m-0 px-2 rounded-xl" onClick={() => setIsEditing(true)}>
                            <EditIcon />
                        </Button>
                    }
                </div>
            }
            <h1 className='text-2xl font-mono'>{user.name}</h1>
            <div className="flex gap-2">
                <h1 className='text-base'>Following: {user.following?.length || 0}</h1>
                <h1 className='text-base'>Followers: {user.followers?.length || 0}</h1>
            </div>
        </div>
    )
}


