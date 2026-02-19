"use client";
import { useState } from "react";
import { Button } from "../ui/button";

const TestCaseResult = ({
	testcases,
}: {
	testcases: { input: string; expected_output: string }[];
}) => {
	const [activeTab, setActiveTab] = useState("testcases");
	const [currentTestCase, setCurrentTestCase] = useState(0);
	return (
		<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
				<h2 className="text-lg font-semibold text-slate-900">Test Panel</h2>
				<div className="ml-auto flex gap-2">
					<Button
						onClick={() => setActiveTab("testcases")}
						variant={activeTab === "testcases" ? "default" : "outline"}
						className={
							activeTab === "testcases"
								? "bg-slate-900 text-white hover:bg-slate-800"
								: "text-slate-700"
						}
					>
						Test Cases
					</Button>
					<Button
						onClick={() => setActiveTab("testresult")}
						variant={activeTab === "testresult" ? "default" : "outline"}
						className={
							activeTab === "testresult"
								? "bg-slate-900 text-white hover:bg-slate-800"
								: "text-slate-700 hover:bg-slate-100"
						}
					>
						Test Result
					</Button>
				</div>
			</div>
			{activeTab === "testcases" && (
				<div className="space-y-4 p-5">
					<div className="flex flex-wrap gap-2">
						{testcases.map((testcase, index) => (
							<Button
								key={index}
								variant={index === currentTestCase ? "default" : "outline"}
								className={
									index === currentTestCase
										? "bg-slate-900 text-white hover:bg-slate-800"
										: "text-slate-700 hover:bg-slate-100"
								}
								onClick={() => setCurrentTestCase(index)}
							>
								Test Case {index + 1}
							</Button>
						))}
					</div>
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
						{testcases.map((testcase, index) => (
							<div
								key={index}
								className={index === currentTestCase ? "space-y-3" : "hidden"}
							>
								<p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
									Input
								</p>
								<pre className="overflow-x-auto rounded-lg bg-white p-3 text-sm text-slate-900 shadow-sm">
									{testcase.input}
								</pre>
								<p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
									Expected Output
								</p>
								<pre className="overflow-x-auto rounded-lg bg-white p-3 text-sm text-slate-900 shadow-sm">
									{testcase.expected_output}
								</pre>
							</div>
						))}
					</div>
				</div>
			)}
			{activeTab === "testresult" && (
				<div className="p-5">
					<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
						<p>Test result will be displayed here after running the code.</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default TestCaseResult;
