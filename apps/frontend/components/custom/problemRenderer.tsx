import type { ProblemDetails } from "@repo/types";
import ReactMardown from "react-markdown";

function ProblemRenderer({problem}: {problem: ProblemDetails}) {

   const { id, title, description, inputStatement, outputStatement, visibleTestCase } = problem;

   const problemMarkdown= '# ' + title + '\n\n' +
   description + '\n\n' +
   '## Input Statement\n\n' +
   inputStatement + '\n\n' +
   '## Output Statement\n\n' +
   outputStatement + '\n\n' +
   '## Sample Test Cases\n\n' +
   visibleTestCase.map((testCase, index) => 
      `### Test Case ${index + 1}\n\n` +
      `**Input:**\n\n` +
      '```\n' +
      testCase.input +
      '\n```\n\n' +
      `**Output:**\n\n` +
      '```\n' +
      testCase.output +
      '\n```\n'
   ).join('\n');

   return (
			<div className="prose max-w-[50%]">
				<ReactMardown skipHtml disallowedElements={["script", "iframe"]}>
					{problemMarkdown}
				</ReactMardown>
			</div>
		);
}

export default ProblemRenderer;