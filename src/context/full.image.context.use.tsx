import { useContext } from "react";
import { FullSizeImageContext } from "./full.image.context";

export function useFullSizeImage() {
  const ctx = useContext(FullSizeImageContext);
  if (!ctx) throw new Error("useFullSizeModal must be used inside ModalProvider");
  return ctx;
}
