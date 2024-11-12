import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isError?: boolean;
  isSuccess?: boolean;
}

const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  title = "Confirmation",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isError = false,
  isSuccess = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md p-6 w-full mx-4
          ${isError ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-blue-500'}
          border-l-4
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">{title}</h2>
          <button onClick={onCancel}>
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-200 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${
              isError
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isSuccess
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
