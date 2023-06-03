import React, { useState } from "react";
import clsx from "clsx";
import { Files } from "./types";

type Props = {
  files: Files;
  activeFile?: string;
  onChange: (key: string) => void;
  onAddFile: (fileName: string) => void;
};

const getFileNameFromPath = (path: string) => {
  return path.split("/").pop();
};

export const EditorTab = ({
  files,
  activeFile,
  onChange,
  onAddFile,
}: Props) => {
  console.log(files, activeFile);
  const [inputMode, setInputMode] = useState(false);
  const handleAddFile = () => {
    setInputMode(true);
  };
  const handleEnterFileName = (e: React.FocusEvent<HTMLInputElement>) => {
    const fileName = e.target.value;
    setInputMode(false);
    if (!fileName) return;
    onAddFile(fileName);
  };
  return (
    <ul className="flex flex-wrap -mb-px">
      {Object.keys(files).map((key) => {
        return (
          <li className="mr-2" key={key}>
            <button
              onClick={() => onChange(key)}
              className={clsx(
                "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                {
                  "bg-gray-800 text-white": activeFile === key,
                }
              )}
            >
              {getFileNameFromPath(key)}
            </button>
          </li>
        );
      })}
      <li className="mr-2">
        <button
          onClick={handleAddFile}
          className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        >
          {inputMode ? (
            <input
              type="text"
              className="bg-transparent outline-none border-none"
              placeholder="New File..."
              onBlur={handleEnterFileName}
            />
          ) : (
            <span>+</span>
          )}
        </button>
      </li>
    </ul>
  );
};
