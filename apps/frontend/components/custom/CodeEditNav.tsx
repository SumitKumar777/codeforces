"use client";
import { Button } from "../ui/button";

const CodeEditNav = () => {
	return (
		<div className="flex justify-end p-4 border-b shrink-0">
			<div className="flex gap-4">
				<Button
					variant={"outline"}
					className="bg-blue-500 hover:bg-blue-600 text-white"
					onClick={() => console.log("hello world")}
				>
					Run Code
				</Button>
				<Button
					variant={"outline"}
					className="bg-green-500 hover:bg-green-600 text-white"
					onClick={() => console.log("submit clicked")}
				>
					Submit
				</Button>
			</div>
		</div>
	);
};

export default CodeEditNav;
