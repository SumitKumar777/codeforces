"use client";

import { Button } from "../ui/button";

const LandingNavbar = () => {
	return (
		<div className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<h1 className="text-xl font-bold text-gray-900">Paapayforces</h1>
					</div>
					<div className="flex items-center">
						<Button onClick={() => (window.location.href = "/auth")}>
							Sign In
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingNavbar;
