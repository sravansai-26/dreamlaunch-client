import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

export interface NameCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onNameSubmit: (name: string) => void;
}

const NameCaptureModal: React.FC<NameCaptureModalProps> = ({
  open,
  onClose,
  onNameSubmit,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
      setName("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-xl font-semibold text-gray-900 text-center">
            Enter Your Name
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Continue
            </motion.button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NameCaptureModal;
