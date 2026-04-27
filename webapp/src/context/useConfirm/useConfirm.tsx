import { use } from "react";
import { ConfirmContext } from "./useConfirmContext";

export const useConfirm = () => {
  const ctx = use(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
};
