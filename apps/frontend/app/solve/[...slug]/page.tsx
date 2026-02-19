import CodingSection from "@/components/custom/CodingSection";
import ProblemRenderer from "@/components/custom/problemRenderer";
import { ApiResponseSchema, ProblemDetailsSchema } from "@repo/types";

const fetchProblem = async (problemId: string) => {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/shared/problem/${problemId}`,
		);
		const data = await response.json();

		const parsedData = ApiResponseSchema(ProblemDetailsSchema).parse(data);
		if (!parsedData) {
			throw new Error("problem data parsing failed");
		}
		console.log("fetched problem data:", parsedData);
		return parsedData;
	} catch (error) {
		console.error("Error fetching problem:", error);
		return null;
	}
};

async function SolvePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug: problemId } = await params;

	const problemData = await fetchProblem(problemId);

	return (
		<div>
			{problemData && problemData.success ? (
				<div className="grid grid-cols-2 h-screen w-full">
					<div className="border-r overflow-y-auto min-h-0 w-full ">
						<ProblemRenderer problem={problemData.data} />
					</div>
					<div className="overflow-y-auto min-h-0">
						<CodingSection testcases={problemData.data.visibleTestCase} />
					</div>
				</div>
			) : (
				<p>Problem not found.</p>
			)}
		</div>
	);
}

export default SolvePage;
