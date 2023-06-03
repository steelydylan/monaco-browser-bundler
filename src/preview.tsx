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
      if (!main) return "";
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
    <iframe
      srcDoc={srcDoc}
      className="flex-1 bg-gray-50 h-full p-2 w-full"
    ></iframe>
  );
};
