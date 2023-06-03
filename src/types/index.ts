export type Files = {
  [key: string]: {
    value: string;
    language: string;
    active?: boolean;
    hidden?: boolean;
  };
};
