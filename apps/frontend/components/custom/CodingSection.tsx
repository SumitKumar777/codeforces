import CodeEditNav from "./CodeEditNav";
import CodeEditor from "./CodeEditor";

import TestCaseResult from "./TestCaseResult";

function CodingSection({
	testcases,
}: {
	testcases: { input: string; expected_output: string }[];
}) {
	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex-6 min-h-0 flex flex-col  w-full">
				<div className="flex-1 min-h-0">
					<CodeEditor />
				</div>
			</div>
			<CodeEditNav />
			<div className="flex-4 min-h-0 overflow-auto p-4">
				<TestCaseResult testcases={testcases} />
			</div>
		</div>
	);
}

export default CodingSection;
