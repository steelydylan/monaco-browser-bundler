import { useEffect } from "react";
import { setUpEditor } from "../setup-editor";
import { Files } from "../types";
import { atom, useRecoilState } from "recoil";

export const browserEditorState = atom({
  key: "browserEditorState",
  default: {
    files: {} as Files,
    dependencies: [] as string[],
  },
});

export const useBrowserEditor = () => {
  const [editorData, setEditorData] = useRecoilState(browserEditorState);
  const { files, dependencies } = editorData;
  useEffect(() => {
    setUpEditor(
      {
        ...files,
      },
      dependencies
    );
  }, [files, dependencies]);

  const setActiveFile = (key: string) => {
    setEditorData((editorData) => ({
      ...editorData,
      files: {
        ...Object.keys(editorData.files).reduce((acc, cur) => {
          acc[cur] = {
            ...editorData.files[cur],
            active: false,
          };
          return acc;
        }, {} as Files),
        [key]: {
          ...editorData.files[key],
          active: true,
        },
      },
    }));
  };
  const updateCode = (code: string) => {
    console.log("update code");
    setEditorData((editorData) => {
      const key = Object.keys(editorData.files).find((key) => {
        if (editorData.files[key].active) {
          return true;
        }
        return false;
      });
      if (!key) {
        return editorData;
      }
      return {
        ...editorData,
        files: {
          ...editorData.files,
          [key]: {
            ...editorData.files[key],
            value: code,
          },
        },
      };
    });
  };

  const activeFile = Object.keys(editorData.files).find((key) => {
    if (editorData.files[key].active) {
      return true;
    }
    return false;
  });

  const activeLanguage = activeFile
    ? editorData.files[activeFile].language
    : "";

  const code = activeFile ? editorData.files[activeFile].value : "";
  const editorFiles = editorData.files;

  return {
    editorData,
    setActiveFile,
    activeFile,
    activeLanguage,
    updateCode,
    code,
    files: editorFiles,
    setEditorData,
  };
};
