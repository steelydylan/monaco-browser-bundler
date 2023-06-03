import React from "react";
import { Files } from "./types";

type Props = {
  files: Files;
  onChange: (key: string) => void;
};

const getFileNameFromPath = (path: string) => {
  return path.split("/").pop();
};

export const EditorTab = ({ files, onChange }: Props) => {
  return (
    <ul className="flex flex-wrap -mb-px">
      {Object.keys(files).map((key) => {
        return (
          <li className="mr-2">
            <button
              onClick={() => onChange(key)}
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            >
              {getFileNameFromPath(key)}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
