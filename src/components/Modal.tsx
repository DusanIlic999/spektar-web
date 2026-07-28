import { createPortal } from "react-dom";

export const SIZES = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

type ESizes = (typeof SIZES)[keyof typeof SIZES];

export const Modal = ({
  children,
  isOpen,
  onClose,
  size,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size: ESizes;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-gray-950 text-white rounded-2xl max-h-150 overflow-y-auto border custom-scroll border-white/10 shadow-2xl max-w-${size} w-full mx-4 p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
