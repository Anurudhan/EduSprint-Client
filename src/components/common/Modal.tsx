import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  isEdit?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, isEdit }: ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn px-4 sm:px-0"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-100 hover:scale-[1.01] ${
          isEdit ? 'max-w-4xl' : 'max-w-lg'
        }`}
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 z-10 py-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};