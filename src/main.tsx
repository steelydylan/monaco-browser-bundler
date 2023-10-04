import React from "react";
import { render } from "react-dom";
import { BrowserEditor } from "./browser-editor";
import { RecoilRoot } from "recoil";
import { Preview } from "./preview";
import { initEditor } from "./utils/setup-editor";

import "./styles/index.css";

const defaultCode = `import React from "react";
import { createRoot } from "react-dom/client";
import { Hello } from "./hello";

createRoot(document.getElementById("root")).render(<Hello rewardType="confetti" />);
`;

const defaultHello = `import React, { useEffect } from "react";
import { useReward } from 'react-rewards'

type Props = {
  rewardType: 'confetti' | 'balloons' | 'emoji'
}

export const Hello = ({ rewardType }: Props) => {
  const { reward } = useReward('rewardId', rewardType)
  const handleClick = () => {
    reward();
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <p className="text-gray-500 my-2">
        You can read the article about this editor here
      </p>
      <p className="my-2">
        <a target="_blank" rel="noopener noreferrer" href="https://zenn.dev/steelydylan/articles/vs-code-experience" className="text-blue-600 underline">https://zenn.dev/steelydylan/articles/vs-code-experience</a>
      </p>
      <p className="text-gray-500 my-2">
        You can also check the source code here
      </p>
      <p className="my-2">
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/steelydylan/monaco-browser-bundler" className="text-blue-600 underline">
          Check the code on GitHub
        </a>
      </p>

      <div className="flex justify-center mt-5">
        <button className="bg-blue-600 text-white block px-4 py-2 text-sm rounded-md" onClick={handleClick}>
          Click me!
        </button>
      </div>
      <div id="rewardId"></div>
      <p className="text-gray-500 my-2">
        Developed by 
        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/steelydylan" className="text-blue-600 underline inline-block ml-2">
          steelydylan
        </a>
      </p>
    </div>
  )
}`;

const defaultPackage = `{
  "name": "react-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.tsx",
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-rewards": "2.0.4"
  },
  "devDependencies": {
    "typescript": "^4.3.5"
  }
}`;

const indexHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React App</title>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18.2.0",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
          "react-rewards": "https://esm.sh/react-rewards@2.0.4"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script src="./index.tsx" type="module"></script>
  </body>
</html>`;

const editorData = {
  files: {
    "./index.html": {
      value: indexHTML,
      language: "html",
      active: false,
    },
    "./index.tsx": {
      value: defaultCode,
      language: "typescript",
      active: true,
    },
    "./hello.tsx": {
      value: defaultHello,
      language: "typescript",
      active: false,
    },
    "./package.json": {
      value: defaultPackage,
      language: "json",
      active: false,
    },
  },
};

const App = () => {
  return (
    <RecoilRoot>
      <div className="flex gap-5 p-5 h-full bg-black h-screen">
        <div className="flex-1 h-full flex flex-row">
          {/* <FileTree /> */}
          <BrowserEditor files={editorData.files} />
        </div>
        <div className="flex-1 h-full w-full">
          <Preview />
        </div>
      </div>
    </RecoilRoot>
  );
};

initEditor().then(() => {
  render(<App />, document.getElementById("root"));
});

navigator.serviceWorker.register("/sw.js", {
  scope: "/mock",
  type: "module",
});
