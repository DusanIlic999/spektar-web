import { createContext } from "react";

interface FullSizeImageValue {
  openFullSizeImage: (content: React.ReactNode) => void;
  closeFullSizeImage: () => void;
}

export const FullSizeImageContext = createContext<FullSizeImageValue | null>(
  null,
);
