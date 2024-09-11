"use client"


import { getUserByEmail, getUserPosts } from "@/drizzle/db";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext({});

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState([] as any);
    const [userPosts, setUserPosts] = useState([] as any)
    const [userEmail, setUserEmail] = useState(null)


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
        <GlobalContext.Provider value={{ userData, setUserData, setUserEmail, userPosts, setUserPosts }}>
            {children}
        </GlobalContext.Provider>
    )
}


export default GlobalProvider