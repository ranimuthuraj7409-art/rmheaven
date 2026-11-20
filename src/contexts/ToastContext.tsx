import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface ToastContextValue {
  showToast: (title: string, variant?: ToastVariant, description?: string) => void;
  confirmAction: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showToast = useCallback((title: string, variant: ToastVariant = 'info', description?: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, variant, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const confirmAction = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, confirmAction }}>
      {children}

      {/* Toast Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((toast) => {
          const iconMap = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />,
            error: <XCircle className="h-5 w-5 text-[#B4434D] shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />,
            info: <Info className="h-5 w-5 text-[#761D2D] shrink-0 mt-0.5" />,
          };
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#292323]/12 bg-white px-4 py-3.5 shadow-lg transition-all duration-200"
            >
              {iconMap[toast.variant]}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#292323]">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-[#292323]/75">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="rounded-md p-1 text-[#292323]/50 hover:bg-[#F8F4ED] hover:text-[#292323]"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#292323]/12 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-2xl font-semibold text-[#292323]">
              {confirmState.options.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
              {confirmState.options.message}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="rounded-lg border border-[#292323]/15 px-4 py-2 text-sm font-medium text-[#292323] hover:bg-[#F8F4ED] transition-colors whitespace-nowrap"
              >
                {confirmState.options.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors whitespace-nowrap ${
                  confirmState.options.destructive
                    ? 'bg-[#B4434D] hover:bg-[#8F2638]'
                    : 'bg-[#761D2D] hover:bg-[#8F2638]'
                }`}
              >
                {confirmState.options.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
