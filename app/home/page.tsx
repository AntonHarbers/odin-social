import Link from "next/link";

export default function home() {
    return (
        <div>
            <Link href={'/api/auth/signout'}>Sign out</Link>
        </div>
    )
}
