import { createContext } from "react";

interface ModalContextValue {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export  const ModalContext = createContext<ModalContextValue | null>(null);

