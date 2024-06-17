import Link from 'next/link';
import React from 'react'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div><Link href={'/api/auth/signout'}>
            Sign Out
        </Link>{children}</div>
    )
}
