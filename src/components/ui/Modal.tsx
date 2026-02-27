"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  // Keyboard close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Body scroll lock — prevents background scroll on mobile when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      {/* Panel — slides up from bottom on mobile, centred on sm+ */}
      <div className="relative z-10 flex w-full flex-col max-w-2xl rounded-t-2xl border border-neutral-800 bg-neutral-950 shadow-2xl sm:rounded-2xl" style={{ maxHeight: "90dvh" }}>
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {/* Large tap target for close button */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
