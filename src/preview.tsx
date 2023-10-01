import React from "react";
import { useDebounce } from "use-debounce";
import { useBrowserEditor } from "./hooks/use-browser-editor";
import localforage from "localforage";

export const Preview = () => {
  const { files } = useBrowserEditor();
  const [debouncedFiles] = useDebounce(files, 500);
  const filesCodes = Object.values(debouncedFiles).map((file) => file?.value);
  const [uniqueId, setUniqueId] = React.useState<string>("");
  React.useEffect(() => {
    async function init() {
      await localforage.setItem("files", debouncedFiles);
      setUniqueId(Math.random().toString(32).substring(2));
    }
    init();
  }, filesCodes);

  return (
    <div className="rounded-md flex-1 h-full overflow-hidden">
      <div className="w-full h-11 rounded-t-lg bg-gray-200 flex justify-start items-center space-x-1.5 px-3">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      <iframe
        key={uniqueId}
        src="/mock/index.html"
        sandbox="allow-scripts allow-same-origin allow-popups-to-escape-sandbox allow-popups"
        className="h-full bg-gray-50 p-2 w-full"
      ></iframe>
    </div>
  );
};
