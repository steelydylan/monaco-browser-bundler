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
import { languages } from "monaco-editor";
import { resolveAllModuleType } from "browser-type-resolver";
import { theme } from "./monaco-theme";

const setCompilerOptions = (lang: typeof languages) => {
  lang.typescript.typescriptDefaults.setCompilerOptions({
    target: lang.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: lang.typescript.ModuleResolutionKind.NodeJs,
    module: lang.typescript.ModuleKind.CommonJS,
    jsx: lang.typescript.JsxEmit.React,
    noEmit: true,
    allowJs: true,
    esModuleInterop: true,
    typeRoots: ["node_modules/@types"],
    lib: ["es2016", "dom"],
  });
  lang.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
};

const textmatePath = "/syntaxes";

const registry = new Registry({
  getGrammarDefinition: async (scopeName) => {
    if (scopeName === "source.tsx") {
      const response = await fetch(
        `${textmatePath}/TypeScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.ts") {
      const response = await fetch(
        `${textmatePath}/TypeScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.js") {
      const response = await fetch(
        `${textmatePath}/JavaScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.jsx") {
      const response = await fetch(
        `${textmatePath}/JavaScriptReact.tmLanguage.json`
      );
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "source.css") {
      const response = await fetch(`${textmatePath}/css.tmLanguage.json`);
      return {
        format: "json",
        content: await response.text(),
      };
    }
    if (scopeName === "text.html.basic") {
      const response = await fetch(`${textmatePath}/html.tmLanguage.json`);
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
  await wireTmGrammars(monaco, registry, grammers);
};

export const setUpEditor = (
  files?: Files,
  dependencies?: Record<string, string>
) => {
  // N0("https://esm.sh/onigasm@2.2.5/lib/onigasm.wasm")
  setCompilerOptions(monaco.languages);
  if (dependencies) {
    resolveAllModuleType(dependencies, { cache: true }).then((types) => {
      Object.entries(types).forEach(([key, value]) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          value,
          `file:///node_modules/${key}`
        );
      });
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
