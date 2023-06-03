import React, { useEffect } from "react";
import * as monaco from "monaco-editor";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  fileName: string;
};

export const Editor = ({ value, onChange, language, fileName }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const editor = monaco.editor.create(container, {
      // value,
      automaticLayout: true,
      theme: "vs-dark",
    });
    editorRef.current = editor;
    if (
      monaco.editor.getModel(
        monaco.Uri.parse(`file:///${fileName.replace("./", "")}`)
      )
    ) {
      const model = monaco.editor.getModel(
        monaco.Uri.parse(`file:///${fileName.replace("./", "")}`)
      );
      editor.setModel(model);
    } else {
      const model = monaco.editor.createModel(
        value,
        language,
        monaco.Uri.parse(`file:///${fileName.replace("./", "")}`)
      );
      editor.setModel(model);
    }
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });
  }, []);

  return <div ref={ref} className="flex-1"></div>;
};
