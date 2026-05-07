import { use } from "react";
import { EditDimensionsContext } from "./useEditDimensionsContext";

export const useEditDimensions = () => {
  const ctx = use(EditDimensionsContext);
  if (!ctx) {
    throw new Error(
      "useEditDimensions must be used within EditDimensionsProvider",
    );
  }
  return ctx;
};
