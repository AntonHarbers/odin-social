"use client"


import { createUser, getUserByEmail, getUserPosts } from "@/drizzle/db";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext({});

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState(null as any);
    const [userPosts, setUserPosts] = useState([] as any)
    const [userEmail, setUserEmail] = useState(null as any)

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
            const response = await getUserByEmail(userEmail)
            setUserData(response)
        }
        const fetchUserPosts = async (email: string) => {
            const postData = await getUserPosts(email)
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