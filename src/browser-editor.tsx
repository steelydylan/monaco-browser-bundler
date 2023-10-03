import React, { useEffect } from "react";
import * as monaco from "monaco-editor";

import { useBrowserEditor } from "./hooks/use-browser-editor";
import { Editor } from "./editor";
import { EditorTab } from "./editor-tab";
import { Files } from "./types";

type Props = {
  files: Files;
  dependencies?: Record<string, string>;
};

export const BrowserEditor = ({ files }: Props) => {
  const {
    setActiveFile,
    activeFile,
    activeLanguage,
    code,
    updateCode,
    setEditorData,
    addFile,
    files: editorFiles,
  } = useBrowserEditor();
  const handleChange = (value: string) => {
    updateCode(value);
  };
  const handleAddFile = (fileName: string) => {
    addFile("./" + fileName);
  };
  useEffect(() => {
    setEditorData({ files });
  }, [files]);

  return (
    <div className="flex gap-5 p-5 h-full flex-1">
      <div className="flex-1 h-full">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:border-gray-700 h-full flex flex-col">
          <EditorTab
            files={editorFiles}
            onChange={(key) => setActiveFile(key)}
            activeFile={activeFile}
            onAddFile={handleAddFile}
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
