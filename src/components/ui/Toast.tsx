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

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
                className={`animate-slide-in-right flex items-center gap-2 rounded px-4 py-3 shadow-lg ${
                  item.type === "success"
                    ? "border border-green-500/60 bg-green-600/90 shadow-green-600/20 text-white"
                    : "border border-red-500/60 bg-red-600 shadow-red-600/20 text-white"
                }`}
              >
                <span className="font-mono text-[11px] tracking-widest uppercase">
                  {item.type === "success" ? "✓" : "✕"}
                </span>
                <span className="font-mono text-[11px] tracking-widest uppercase flex-1">
                  {item.message}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="ml-2 shrink-0 font-mono text-[11px] tracking-widest opacity-60 transition-opacity hover:opacity-100"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}
