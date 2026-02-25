"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error";
type ToastItem = { id: string; message: string; type: ToastType };
type ToastCtxValue = { toast: (msg: string, type?: ToastType) => void };

const ToastCtx = createContext<ToastCtxValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
                  item.type === "success"
                    ? "bg-blue-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                <span>{item.type === "success" ? "✓" : "✕"}</span>
                <span>{item.message}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}
