// components/ui/use-toast.ts
import React, { createContext, useContext, useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastOptions = Omit<Toast, 'id'>;

type ToastContextType = {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...options };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    if (options.duration !== 0) {
      setTimeout(() => {
        dismissToast(id);
      }, options.duration || 3000);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ToastViewport component would be defined with your actual toast component
function ToastViewport() {
  const { toasts, dismissToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}