import { createContext } from "react";

export type ConfirmOptions = {
  title: string;
  description: string;
  actionText: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "inherit";
  loading?: boolean;
};

export type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  close: () => void;
};

export const ConfirmContext = createContext<ConfirmContextType | null>(null);
