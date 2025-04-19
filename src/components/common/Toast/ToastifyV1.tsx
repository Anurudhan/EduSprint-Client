import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Define toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Define toast interface
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Define context interface
interface ToastContextType {
  showToast: (message: string, type: ToastType) => number;
  removeToast: (id: number) => void;
  success: (message: string) => number;
  error: (message: string) => number;
  warning: (message: string) => number;
  info: (message: string) => number;
}

// Create Toast Context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast Service to allow global toast triggering
class ToastService {
  private static toastContext: ToastContextType | null = null;

  static setContext(context: ToastContextType) {
    this.toastContext = context;
  }

  static success(message: string): number {
    if (!this.toastContext) {
      console.warn('ToastService: Toast context not initialized');
      return 0;
    }
    return this.toastContext.success(message);
  }

  static error(message: string): number {
    if (!this.toastContext) {
      console.warn('ToastService: Toast context not initialized');
      return 0;
    }
    return this.toastContext.error(message);
  }

  static warning(message: string): number {
    if (!this.toastContext) {
      console.warn('ToastService: Toast context not initialized');
      return 0;
    }
    return this.toastContext.warning(message);
  }

  static info(message: string): number {
    if (!this.toastContext) {
      console.warn('ToastService: Toast context not initialized');
      return 0;
    }
    return this.toastContext.info(message);
  }
}

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

// Toast Provider Component
export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Toast functions
  const showToast = useCallback((message: string, type: ToastType = 'info'): number => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
    
    return id;
  }, []);
  
  const removeToast = useCallback((id: number): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Convenience methods for different toast types
  const success = useCallback((message: string): number => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string): number => showToast(message, 'error'), [showToast]);
  const warning = useCallback((message: string): number => showToast(message, 'warning'), [showToast]);
  const info = useCallback((message: string): number => showToast(message, 'info'), [showToast]);
  
  const value: ToastContextType = {
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  // Set the context for the ToastService
  useEffect(() => {
    ToastService.setContext(value);
  }, [value]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Custom hook to use toast (optional, for component-level usage)
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast container component
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps): JSX.Element {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-md px-4">
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Individual Toast component
function Toast({ toast, onClose }: ToastProps): JSX.Element {
  const [isExiting, setIsExiting] = useState<boolean>(false);
  
  useEffect(() => {
    // Set up exit animation
    const timeoutId = setTimeout(() => {
      setIsExiting(true);
    }, 3700); // Start exit animation 300ms before removal
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Get icon and styles based on toast type
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };
  
  // Get toast styles based on type
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: "bg-green-100 dark:bg-green-900 border-green-500",
          text: "text-green-800 dark:text-green-100",
          icon: "text-green-500 dark:text-green-400"
        };
      case 'error':
        return {
          bg: "bg-red-100 dark:bg-red-900 border-red-500",
          text: "text-red-800 dark:text-red-100",
          icon: "text-red-500 dark:text-red-400"
        };
      case 'warning':
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900 border-yellow-500",
          text: "text-yellow-800 dark:text-yellow-100",
          icon: "text-yellow-500 dark:text-yellow-400"
        };
      case 'info':
      default:
        return {
          bg: "bg-blue-100 dark:bg-blue-900 border-blue-500",
          text: "text-blue-800 dark:text-blue-100",
          icon: "text-blue-500 dark:text-blue-400"
        };
    }
  };
  
  const styles = getToastStyles(toast.type);
  const icon = getToastIcon(toast.type);
  
  return (
    <div 
      className={`${styles.bg} ${styles.text} border-l-4 rounded shadow-md flex items-center w-full p-3 transition-all duration-300 ${isExiting ? 'opacity-0 translate-y-1' : 'opacity-100'}`}
    >
      <div className={`${styles.icon} mr-3 flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        {toast.message}
      </div>
      <button 
        onClick={onClose} 
        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Export the ToastService for use in other parts of the application
export { ToastService };