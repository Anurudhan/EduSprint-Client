
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmModal2: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: -50, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-lg bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-800/20 overflow-hidden backdrop-blur-xl"
          >
            {/* Gradient header accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${isDanger ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="relative px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 text-sm font-medium overflow-hidden group"
                >
                  <span className="relative z-10">{cancelText}</span>
                  <motion.span
                    className="absolute inset-0 bg-gray-200/20 dark:bg-gray-700/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium overflow-hidden group ${
                    isDanger
                      ? 'text-white bg-gradient-to-r from-red-500 to-pink-500'
                      : 'text-white bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                >
                  <span className="relative z-10">{confirmText}</span>
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'center' }}
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-red-600 dark:to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};