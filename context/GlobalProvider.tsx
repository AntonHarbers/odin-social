"use client"

import { Post, UserData } from "@/app/lib/types";
import { createUser, getUserByEmail } from "@/drizzle/db/userDb";
import { getUserPosts } from "@/drizzle/db/postDb";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext({});

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState(null as UserData | null);
    const [userPosts, setUserPosts] = useState([] as Post[])
    const [userEmail, setUserEmail] = useState(null as string | null)
    const { data: session } = useSession()

    useEffect(() => {
        if (!session) return
        if (session.user?.name && session.user?.email) {
            createUser(session.user?.name, session.user?.email, session.user?.image!)
            setUserEmail(session.user?.email)
        }
    }, [session, setUserEmail])

    useEffect(() => {
        if (!userEmail) return
        const fetchUserData = async (email: string) => {
            const response: UserData | null = await getUserByEmail(userEmail)
            setUserData(response)
        }
        const fetchUserPosts = async (email: string) => {
            const postData: Post[] = await getUserPosts(email)
            setUserPosts(postData)
        }
        fetchUserData(userEmail)
        fetchUserPosts(userEmail)
    }, [userEmail]);

    return (
        <GlobalContext.Provider value={{ userData, setUserData, userPosts, setUserPosts }}>
            {children}
        </GlobalContext.Provider>
    )
}


export default GlobalProvider