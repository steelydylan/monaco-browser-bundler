import { languages } from "monaco-editor"

export const setCompilerOptions = (lang: typeof languages) => {
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
  noSyntaxValidation: false
})
};

export const resolveModuleType = async (module: string, lang: typeof languages) => {
  const res = await fetch(`https://esm.sh/${module}`)
  const dtsUrl = res.headers.get("x-typescript-types")
  if (!dtsUrl) return "";
  const dts = await fetch(dtsUrl);
  const dtsText = await dts.text();
  lang.typescript.typescriptDefaults.addExtraLib(dtsText, `file:///node_modules/@types/${module}/index.d.ts`);
}

  