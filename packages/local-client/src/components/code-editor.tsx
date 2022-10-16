import './code-editor.css';
import './syntax.css';

import { useRef, useEffect, useState } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
	initialValue: string;
	onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
	const [vars, setVars] = useState<any>({});
	const editorRef = useRef<any>();
	const { monacoEditor, monaco } = vars;

	const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
		setVars({ monacoEditor, getValue });

		editorRef.current = monacoEditor;
		monacoEditor.onDidChangeModelContent(() => {
			onChange(getValue());
		});

		monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

		if (!monacoEditor || !monaco) {
			return;
		}

		const highlighter = new Highlighter(
			// @ts-ignore
			window.monaco,
			codeShift,
			monacoEditor
		);
		highlighter.highLightOnDidChangeModelContent(
			() => {},
			() => {},
			undefined,
			() => {}
		);
	};

	useEffect(() => {
		if (!monacoEditor || !monaco) {
			return;
		}
	}, [monaco, monacoEditor]);

	const onFormatClick = () => {
		// get current value from editor
		const unformatted = editorRef.current.getModel().getValue();

		// format that value
		const formatted = prettier
			.format(unformatted, {
				parser: 'babel',
				plugins: [parser],
				useTabs: false,
				semi: true,
				singleQuote: true,
			})
			.replace(/\n$/, '');

		// set the formatted value back in the editor
		editorRef.current.setValue(formatted);
	};

	return (
		<div className='editor-wrapper'>
			<button
				className='button button-format is-primary is-small'
				onClick={onFormatClick}>
				Format
			</button>
			<MonacoEditor
				editorDidMount={onEditorDidMount}
				value={initialValue}
				theme='dark'
				language='javascript'
				height='100%'
				options={{
					wordWrap: 'on',
					minimap: { enabled: false },
					showUnused: false,
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
