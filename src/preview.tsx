import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { HashLoader } from "react-spinners";

import { useBrowserEditor } from "./hooks/use-browser-editor";

export const Preview = () => {
  const { files } = useBrowserEditor();
  const [uniqueId, setUniqueId] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    async function init() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await localforage.setItem("files", files);
      setUniqueId(Math.random().toString(32).substring(2));
      setIsReady(true);
    }
    init();
  }, [files]);

  return (
    <div className="rounded-md flex-1 h-full overflow-hidden">
      <div className="w-full h-11 rounded-t-lg bg-gray-200 flex justify-start items-center space-x-1.5 px-3">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      {isReady && (
        <iframe
          key={uniqueId}
          src="/mock/index.html"
          sandbox="allow-scripts allow-same-origin allow-popups-to-escape-sandbox allow-popups"
          className="h-full bg-gray-50 p-2 w-full"
        ></iframe>
      )}
      {!isReady && (
        <div className="grid place-items-center h-full w-full">
          <HashLoader color="#36d7b7" />
        </div>
      )}
    </div>
  );
};
