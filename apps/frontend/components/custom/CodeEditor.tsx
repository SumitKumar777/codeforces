"use client";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
	return (
		<div className="w-full max-w-4xl mx-auto br-1 pt-4">
			<Editor
				height="600px"
				language="cpp"
				defaultValue={`#include <iostream>
                          using namespace std;

              int main() {
    cout << "Hello World";
    return 0;
}`}
			/>
		</div>
	);
};

export default CodeEditor;
