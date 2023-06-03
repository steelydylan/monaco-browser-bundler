import React from "react";
import clsx from "clsx";
import { Files } from "./types";

type Props = {
  files: Files;
  activeFile?: string;
  onChange: (key: string) => void;
};

const getFileNameFromPath = (path: string) => {
  return path.split("/").pop();
};

export const EditorTab = ({ files, activeFile, onChange }: Props) => {
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
    </ul>
  );
};
