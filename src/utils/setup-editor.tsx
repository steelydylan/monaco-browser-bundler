import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import { wireTmGrammars } from "monaco-editor-textmate";
import { Registry } from "monaco-textmate"; // peer dependency
import { loadWASM } from "onigasm"; // peer dependency of 'monaco-textmate'
import { resolveModuleType, setCompilerOptions } from "./monaco-types-resolver";
import { theme } from "./monaco-theme";

const textmatePath =
  "https://esm.sh/githubusercontent/microsoft/vscode/main/extensions";

const registry = new Registry({
  getGrammarDefinition: async (scopeName) => {
    if (scopeName === "source.tsx") {
      const response = await fetch(
        `${textmatePath}/typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.ts") {
      const response = await fetch(
        `${textmatePath}/typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.js") {
      const response = await fetch(
        `${textmatePath}/javascript/syntaxes/JavaScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.jsx") {
      const response = await fetch(
        `${textmatePath}/javascript/syntaxes/JavaScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.css") {
      const response = await fetch(
        `${textmatePath}/css/syntaxes/css.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "text.html.basic") {
      const response = await fetch(
        `${textmatePath}/html/syntaxes/html.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.json") {
      const response = await fetch(
        `${textmatePath}/json/syntaxes/JSON.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    return {
      format: "json",
      content: "",
    };
  },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "typescript" || label === "javascript") return new TsWorker();
    if (label === "json") return new JsonWorker();
    if (label === "css") return new CssWorker();
    if (label === "html") return new HtmlWorker();
    return new EditorWorker();
  },
};

type Files = {
  [key: string]: {
    value: string;
    language: string;
  };
};

export const initEditor = async () => {
  await loadWASM("https://esm.sh/onigasm@2.2.5/lib/onigasm.wasm");
  monaco.editor.defineTheme("myTheme", theme);
  monaco.editor.setTheme("myTheme");
  const grammers = new Map();
  grammers.set("typescript", "source.tsx");
  grammers.set("javascript", "source.jsx");
  grammers.set("css", "source.css");
  grammers.set("html", "text.html.basic");
  grammers.set("json", "source.json");
  await wireTmGrammars(monaco, registry, grammers);
};

export const setUpEditor = (files?: Files, dependencies?: string[]) => {
  // N0("https://esm.sh/onigasm@2.2.5/lib/onigasm.wasm")
  setCompilerOptions(monaco.languages);
  if (dependencies) {
    dependencies.forEach((dep) => {
      resolveModuleType(dep, monaco.languages);
    });
  }
  if (!files) return;
  Object.keys(files).forEach((key) => {
    const file = files[key];
    const model = monaco.editor.getModel(
      monaco.Uri.parse(`file:///${key.replace("./", "")}`)
    );
    if (!model) {
      const model = monaco.editor.createModel(
        file.value,
        file.language,
        monaco.Uri.parse(`file:///${key.replace("./", "")}`)
      );
      model.setValue(file.value);
    }
  });
};
