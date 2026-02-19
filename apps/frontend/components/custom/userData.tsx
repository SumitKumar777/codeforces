"use client";
import { useSession } from "@/app/lib/auth-client";
import Signout from "@/components/custom/signout";

function UserData() {
	const { data: session, isPending, error, refetch } = useSession();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			{session ? (
				<div className=" ">
					<div>
						<p>Welcome, {session.user.name}!</p>
						<p>Your role: {session.user.role}</p>
						<p>Session is {JSON.stringify(session)}</p>
					</div>
					<div>
						<Signout />
					</div>
				</div>
			) : (
				<p>You are not logged in.</p>
			)}
		</div>
	);
}

export default UserData;
