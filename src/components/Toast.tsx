import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      // Auto-hide non-persistent toasts
      if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, newToast.duration);
      }
    },
    [maxToasts]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, hideToast, clearAllToasts }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { hideToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => hideToast(toast.id), 300); // Animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertCircle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div
      className={`toast toast-${toast.type} ${
        isVisible ? "toast-visible" : ""
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Convenience hooks for different toast types
export const useSuccessToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (title: string, message?: string) => {
      showToast({ type: "success", title, message });
    },
    [showToast]
  );
};

export const useErrorToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (title: string, message?: string) => {
      showToast({ type: "error", title, message, persistent: true });
    },
    [showToast]
  );
};

export const useInfoToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (title: string, message?: string) => {
      showToast({ type: "info", title, message });
    },
    [showToast]
  );
};

export const useWarningToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (title: string, message?: string) => {
      showToast({ type: "warning", title, message });
    },
    [showToast]
  );
};
