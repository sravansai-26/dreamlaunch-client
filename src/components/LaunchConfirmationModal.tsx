// client/src/components/LaunchConfirmationModal.tsx
import React from 'react';
import { X } from 'lucide-react'; // Import the X icon

interface LaunchConfirmationModalProps { // Corrected name here
  open: boolean;
  onClose: () => void;
  onConfirm: (proceed: boolean) => void;
  title: string;
}

const LaunchConfirmationModal: React.FC<LaunchConfirmationModalProps> = ({ open, onClose, onConfirm, title }) => { // Corrected name here
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700 max-w-sm w-full text-center transform scale-95 animate-scale-in relative">
        
        {/* Close Button (X icon) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-4">Ready to Launch?</h3>
        <p className="text-gray-300 mb-6">
          You just finished viewing "{title}". As a special user, you can now launch this content to YouTube.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onConfirm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Yes! Proceed
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            No! Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchConfirmationModal;