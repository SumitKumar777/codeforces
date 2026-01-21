"use client"
import { signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Signout() {
	const router = useRouter();

	async function handleSignOut() {
		await signOut();
		router.push("/auth");
	}

	return (

			<button type="button" onClick={handleSignOut}>
				Sign Out
			</button>
	);
}
