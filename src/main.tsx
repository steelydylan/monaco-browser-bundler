import React from "react";
import { render } from "react-dom";
import { BrowserEditor } from "./browser-editor";
import { RecoilRoot } from "recoil";
import { Preview } from "./preview";

const defaultCode = `import React from "react";
import { render } from "react-dom";
import { Hello } from "./hello";

render(<Hello />, document.getElementById("root"));
`;

const defaultHello = `import React from "react";

export const Hello = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <p className="text-gray-500">This is a sample page.</p>
    </div>
  )
}
`;

const defaultPackage = `{
  "name": "react-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.tsx",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "typescript": "^4.3.5"
  }
}`;

const editorData = {
  files: {
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
          <Preview entryPoint="./index.tsx" />
        </div>
      </div>
    </RecoilRoot>
  );
};

render(<App />, document.getElementById("root"));
