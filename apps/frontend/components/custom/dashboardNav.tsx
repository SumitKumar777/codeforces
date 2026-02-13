"use client";

import Link from "next/link";

const DashboardNav = () => {
	return (
		<div className="bg-white shadow-sm">
			<div className=" mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<h1 className="text-xl font-bold text-gray-900">Paapayforces</h1>

						<Link
							href="/dashboard"
							className="ml-4 text-gray-700 hover:text-gray-900"
						>
							Problems
						</Link>
						<Link
							href="/contests"
							className="ml-4 text-gray-700 hover:text-gray-900"
						>
							Contests
						</Link>
					</div>
					<div className="flex items-center">
						<Link
							href="/user"
							className="ml-4 text-gray-700 hover:text-gray-900"
						>
							Profile
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardNav;
