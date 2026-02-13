import CreateContest from "@/components/custom/createContest";

const contestsPage = () => {
	return (
		<div>
			<div className="p-4 flex justify-between items-center">
				<h1>Contests Page</h1>
				<CreateContest />
			</div>
			<div>
				<p>List of contests will be displayed here.</p>
			</div>
		</div>
	);
};

export default contestsPage;
