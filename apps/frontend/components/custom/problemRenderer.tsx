import type { ProblemDetails } from "@repo/types";
import ReactMardown from "react-markdown";

function ProblemRenderer({ problem }: { problem: ProblemDetails }) {
	const {
		title,
		description,
		inputStatement,
		outputStatement,
		visibleTestCase,
	} = problem;

	const problemMarkdown =
		"# " +
		title +
		"\n\n" +
		description +
		"\n\n" +
		"## Input Statement\n\n" +
		inputStatement +
		"\n\n" +
		"## Output Statement\n\n" +
		outputStatement +
		"\n\n" +
		"## Sample Test Cases\n\n" +
		visibleTestCase
			.map(
				(testCase, index) =>
					`### Test Case ${index + 1}\n\n` +
					`**Input:**\n\n` +
					"```\n" +
					testCase.input +
					"\n```\n\n" +
					`**Output:**\n\n` +
					"```\n" +
					testCase.expected_output +
					"\n```\n",
			)
			.join("\n");

	return (
		<div className="w-full h-full">
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div className="px-6 py-8 sm:px-10">
					<ReactMardown
						skipHtml
						disallowedElements={["script", "iframe"]}
						components={{
							h1: ({ children }) => (
								<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
									{children}
								</h1>
							),
							h2: ({ children }) => (
								<h2 className="mt-8 text-2xl font-semibold text-slate-900">
									{children}
								</h2>
							),
							h3: ({ children }) => (
								<h3 className="mt-6 text-xl font-semibold text-slate-900">
									{children}
								</h3>
							),
							p: ({ children }) => (
								<p className="mt-4 text-base leading-7 text-slate-700">
									{children}
								</p>
							),
							strong: ({ children }) => (
								<strong className="font-semibold text-slate-900">
									{children}
								</strong>
							),
							ul: ({ children }) => (
								<ul className="mt-4 list-disc pl-6 text-slate-700">
									{children}
								</ul>
							),
							ol: ({ children }) => (
								<ol className="mt-4 list-decimal pl-6 text-slate-700">
									{children}
								</ol>
							),
							li: ({ children }) => (
								<li className="mt-2 leading-7">{children}</li>
							),
							pre: ({ children }) => (
								<pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100 shadow-inner">
									{children}
								</pre>
							),
							code: ({ children, ...props }: any) =>
								props.inline ? (
									<code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-900">
										{children}
									</code>
								) : (
									<code className="text-slate-100">{children}</code>
								),
							a: ({ children, href }) => (
								<a
									href={href}
									className="text-slate-900 underline underline-offset-4"
								>
									{children}
								</a>
							),
						}}
					>
						{problemMarkdown}
					</ReactMardown>
				</div>
			</div>
		</div>
	);
}

export default ProblemRenderer;
