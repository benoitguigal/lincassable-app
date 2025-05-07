import { Rule } from "antd/es/form";

export const positiveRule: Rule = {
  validator: (_, value) => {
    return value === null || value === undefined || value >= 0
      ? Promise.resolve()
      : Promise.reject(new Error("Doit être positif"));
  },
};
