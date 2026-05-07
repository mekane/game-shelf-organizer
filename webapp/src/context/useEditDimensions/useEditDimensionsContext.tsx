import { createContext } from "react";

export interface Dimensions {
  width: number;
  length: number;
  height: number;
}

export type EditDimensionsContextType = {
  showEditor: (initialValues: Dimensions) => Promise<Dimensions>;
};

export const EditDimensionsContext =
  createContext<EditDimensionsContextType | null>(null);
