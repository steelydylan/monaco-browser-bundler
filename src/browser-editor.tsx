import React, { useEffect } from "react";
import { useBrowserEditor } from "./hooks/use-browser-editor";
import { Editor } from "./editor";
import { EditorTab } from "./editor-tab";
import { Files } from "./types";

type Props = {
  files: Files;
  dependencies?: string[];
};

export const BrowserEditor = ({ files, dependencies }: Props) => {
  const {
    setActiveFile,
    activeFile,
    activeLanguage,
    code,
    updateCode,
    setEditorData,
  } = useBrowserEditor();
  const handleChange = (value: string) => {
    updateCode(value);
  };

  useEffect(() => {
    setEditorData({ files, dependencies: dependencies ?? [] });
  }, [files, dependencies]);

  return (
    <div className="flex gap-5 p-5 h-full">
      <div className="flex-1 h-full">
        <div className="text-sm font-medium text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 h-full flex flex-col">
          <EditorTab
            files={files}
            onChange={(key) => setActiveFile(key)}
            activeFile={activeFile}
          />
          {activeFile && (
            <Editor
              key={activeFile}
              language={activeLanguage}
              fileName={activeFile}
              value={code}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
