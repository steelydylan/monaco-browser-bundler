import React from 'react';
import * as monaco from 'monaco-editor'

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  fileName: string;
}

export const Editor = ({ value, onChange, language, fileName }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const editor = monaco.editor.create(container, {
      // value,
      automaticLayout: true,
      theme: 'vs-dark',
    });
    if (monaco.editor.getModel(monaco.Uri.parse(fileName))) {
      const model = monaco.editor.getModel(monaco.Uri.parse(fileName));
      editor.setModel(model);
    } else {
      const model = monaco.editor.createModel(value, language, monaco.Uri.parse(fileName));
      editor.setModel(model);
    }
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });
  }, []);

  return (
    <div ref={ref} style={{ height: "100vh" }}></div>
  )
}


