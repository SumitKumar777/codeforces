import Link from "next/link";
function Auth() {
   return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
				<h1 className="text-4xl font-bold mb-4">Auth Page</h1>
				<p className="text-lg text-gray-700">
					Welcome to the authentication page.
				</p>
				<div className="flex gap-4">
					<Link
						href="/auth/signup"
						className="mt-6 text-blue-500 hover:underline"
					>
						Go to signup
					</Link>
					<Link
						href="/auth/signin"
						className="mt-6 text-blue-500 hover:underline"
					>
						Go to signin
					</Link>
				</div>
			</div>
		);
}

export default Auth;