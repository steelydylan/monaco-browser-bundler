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

const getLanguageFromFileName = (fileName: string) => {
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "jsx":
      return "javascript";
    case "css":
      return "css";
    case "html":
      return "html";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "yml":
      return "yaml";
    default:
      return "txt";
  }
};

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

  const addFile = (key: string) => {
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
          value: "",
          hidden: false,
          active: true,
          language: getLanguageFromFileName(key),
        },
      },
    }));
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
    addFile,
    setActiveFile,
    activeFile,
    activeLanguage,
    updateCode,
    code,
    files: editorFiles,
    setEditorData,
  };
};
