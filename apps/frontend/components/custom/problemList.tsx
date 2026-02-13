import SolveButton from "@/components/custom/solveButton";

const fetchProbem = async () => {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/shared/problemList`,
		);
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error fetching problem:", error);
		return null;
	}
};

async function GetProblem() {
	const problemData = await fetchProbem();
	console.log("problem data in frontend getproblem page ", problemData);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Problem List</h1>
			{problemData && problemData.success ? (
				<ul>
					{problemData.data.map((problem: { id: number; title: string }) => (
						<li key={problem.id} className="mb-2 flex justify-between">
							<div>
								<span className="font-medium">ID:</span> {problem.id} -{" "}
								<span className="font-medium">Title:</span> {problem.title}
							</div>
							<SolveButton problemId={problem.id.toString()} />
						</li>
					))}
				</ul>
			) : (
				<p>No problems available.</p>
			)}
		</div>
	);
}

export default GetProblem;
