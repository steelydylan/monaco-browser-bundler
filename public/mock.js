import initSwc, { transformSync } from "https://esm.sh/@swc/wasm-web@1.3.90";

function resolveImportFromStorage(storage, fileName) {
  const fileNames = [
    fileName.replace(".mjs", ".jsx"),
    fileName.replace(".mjs", ".js"),
    fileName.replace(".mjs", ".ts"),
    fileName.replace(".mjs", ".tsx"),
  ];
  for (const name of fileNames) {
    console.log(name, storage);
    if (storage["./" + name]) {
      return storage["./" + name];
    }
  }
}

export async function mockJS(storage, fileName) {
  // mjsでアクセスされた場合はjsxとして扱う
  const file = resolveImportFromStorage(storage, fileName);
  if (!file || !file.value || !file.language) {
    throw new Error("not found");
  }
  const { value } = file;
  // コードの相対インポートをmjsに変換する
  const mjsCode = value.replace(
    /from\s+["'](\.\/[^"']+)["']/g,
    "from '$1.mjs'"
  );

  await initSwc();

  const { code } = transformSync(mjsCode, {
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true,
      },
      transform: {
        react: {
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
          throwIfNamespace: true,
          development: false,
          useBuiltins: false,
        },
      },
    },
  });
  return code;
}
