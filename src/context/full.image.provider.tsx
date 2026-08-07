import { useState } from "react";
import { FullSizeImageContext } from "./full.image.context";
import { FullSizeImage } from "../components/FullSizeImage";

export function FullSizeImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openFullSizeImage = (node: React.ReactNode) => {
    setContent(node);
    setIsOpen(true);
  };

  const closeFullSizeImage = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <FullSizeImageContext.Provider
      value={{ openFullSizeImage, closeFullSizeImage }}
    >
      {children}
      <FullSizeImage isOpen={isOpen} onClose={closeFullSizeImage}>
        {content}
      </FullSizeImage>
    </FullSizeImageContext.Provider>
  );
}
