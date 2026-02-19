"use client";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import { Form } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
type Monaco = typeof import("monaco-editor");

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
	cout << "Hello World";
	return 0;
}`;

const CodeEditor = () => {
	const [code, setCode] = useState(DEFAULT_CODE);
	const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

	const handleEditorChange = (value: string | undefined) => {
		setCode(value ?? "");
	};

	const handleEditorMount = (
		editor: MonacoEditor.IStandaloneCodeEditor,
		monoco: Monaco,
	) => {
		editorRef.current = editor;
	};

	const handleBeforeMount = (monaco: Monaco) => {
		// no-op for now; hook is kept for future monaco customization
	};

	const handleReset = useCallback(() => {
		if (editorRef.current) {
			editorRef.current.setValue(DEFAULT_CODE);
		}
		setCode(DEFAULT_CODE);
	}, []);

	const handleFormat = useCallback(() => {
		if (!editorRef.current) {
			console.log("Editor not mounted yet");
			return;
		}
		const formatAction = editorRef.current.getAction(
			"editor.action.formatDocument",
		);
		if (formatAction) {
			formatAction.run();
		}
	}, []);

	return (
		<div className="w-full h-full pt-4 flex flex-col min-h-0">
			<div className="flex justify-end mr-4 shrink-0">
				<Button className="hover:bg-slate-300" size="sm" onClick={handleReset}>
					<RotateCcw />
				</Button>
				<Button
					size="sm"
					className="ml-2 hover:bg-slate-300"
					onClick={handleFormat}
				>
					<Form />
				</Button>
			</div>

			<div className="flex-1 min-h-0">
				<Editor
					height="100%"
					language="cpp"
					value={code}
					onChange={handleEditorChange}
					onMount={handleEditorMount}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
					}}
					beforeMount={handleBeforeMount}
				/>
			</div>
		</div>
	);
};

export default CodeEditor;
