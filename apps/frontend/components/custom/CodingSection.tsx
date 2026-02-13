import CodeEditor from "./CodeEditor";
import TestCaseResult from "./TestCaseResult";

function CodingSection() {
	return (
		<div className="flex flex-col items-center   h-full">
			<div className="w-full overflow-auto min-h-0 border-b ">
				<CodeEditor />
			</div>
			<TestCaseResult />
		</div>
	);
}

export default CodingSection;
