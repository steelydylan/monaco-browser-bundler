import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import {
  resolveModuleType,
  setCompilerOptions,
} from "./utils/monaco-types-resolver";
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

export const setUpEditor = (files?: Files, dependencies?: string[]) => {
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
