import { useState } from "react";
import { ModalContext } from "./modal.context";
import { Modal } from "../components/Modal";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (node: React.ReactNode) => {
    setContent(node);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}
