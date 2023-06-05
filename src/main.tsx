import React from "react";
import { render } from "react-dom";
import { BrowserEditor } from "./browser-editor";
import { RecoilRoot } from "recoil";
import { Preview } from "./preview";
import { initEditor } from "./utils/setup-editor";

const defaultCode = `import React from "react";
import { render } from "react-dom";
import { Hello } from "./hello";

render(<Hello rewardType="confetti" />, document.getElementById("root"));
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
      <p className="text-gray-500">This is a sample page.</p>
      <div className="flex justify-center mt-5">
        <button className="bg-blue-600 text-white block px-4 py-2 text-sm rounded-md" onClick={handleClick}>
          クリックしてね
        </button>
      </div>
      <div id="rewardId"></div>
    </div>
  )
}`;

const defaultPackage = `{
  "name": "react-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.tsx",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-rewards": "2.0.4"
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

initEditor().then(() => {
  render(<App />, document.getElementById("root"));
});
