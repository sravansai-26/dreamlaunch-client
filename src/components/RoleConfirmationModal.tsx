import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import React from "react";

export interface RoleConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSelectRole: (role: "general" | "special") => void;
}

const RoleConfirmationModal: React.FC<RoleConfirmationModalProps> = ({
  open,
  onClose,
  onSelectRole,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-xl font-semibold text-gray-900 text-center">
            Are you the special person launching this?
          </Dialog.Title>
          <div className="flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectRole("special")}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Yes, I am the Chief/Special Person
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectRole("general")}
              className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              No, I am a General User
            </motion.button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RoleConfirmationModal;
