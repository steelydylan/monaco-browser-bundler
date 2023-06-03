import React from "react";
import { browserBundle } from "browser-bundler";
import { useBrowserEditor } from "./hooks/use-browser-editor";

type Props = {
  entryPoint: string;
};

const buildSrcDoc = (code: string) => {
  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          ${code}
        </script>
      </body>
    </html>
    `;
};

export const Preview = ({ entryPoint }: Props) => {
  const { files } = useBrowserEditor();
  const [srcDoc, setSrcDoc] = React.useState("");
  React.useEffect(() => {
    async function init() {
      const main = files[entryPoint];
      if (!main) return;
      const bundledFiles = Object.entries(files).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {});
      const { code } = await browserBundle(main.value, {
        files: bundledFiles,
      });
      const result = buildSrcDoc(code);
      setSrcDoc(result);
    }
    init();
  }, [files, entryPoint]);

  return (
    <div className="rounded-md flex-1 h-full overflow-hidden">
      <div className="w-full h-11 rounded-t-lg bg-gray-200 flex justify-start items-center space-x-1.5 px-3">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      <iframe srcDoc={srcDoc} className="h-full bg-gray-50 p-2 w-full"></iframe>
    </div>
  );
};
