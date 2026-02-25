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
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {title && (
          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
