import { atomFamily } from "recoil";
import { Files } from "../types";

type State = {
  files: Files;
};

type Option = {
  files: Files;
};

export const editorDataState = atomFamily<State, Option>({
  key: "browserEditorDataState",
  default: (options) =>
    ({
      files: options.files,
    } as State),
});
