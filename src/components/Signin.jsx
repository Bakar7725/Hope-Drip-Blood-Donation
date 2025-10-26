// SigninModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import logo from "./images/1.png";
import { X } from "lucide-react";

export default function SigninModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0f1f1f] p-6 rounded-lg w-80 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <img
            src={logo} // replace with your logo path
            alt="Hope Drip"
            className="w-9 h-8"
          />
          <h2 className="text-2xl font-bold text-[#c2d8c4]">Hope Drip</h2>
          <p className="text-gray-400 text-sm">Sign in to continue</p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-5">
          <button className="bg-[#c2d8c4] text-[#0f1f1f] font-semibold px-6 py-2 rounded-md hover:bg-[#a8c4a9] transition">
            Sign In
          </button>
          <a href='#' className="text-sm text-gray-400 hover:underline">
            Forgot password
          </a>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          © 2025 Hope Drip. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}