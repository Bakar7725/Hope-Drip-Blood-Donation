import logo from "./images/1.png";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { useState } from "react";

function Donor({ B }) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cnic: "",
    blood: "",
    city: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-[#0F1325] rounded-md shadow-md w-full max-w-xl p-8 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors"
          onClick={B}
        >
          <RxCross2 />
        </button>

        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Hope Drip Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-[#c2d8c4] text-2xl font-semibold text-center">Hope Drip</h2>
          <p className="text-gray-400 text-sm text-center">Blood Donor Registration Form</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-12 w-full rounded-md px-4 border border-gray-700 bg-[#1A1F3D] text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="h-12 w-full rounded-md px-4 border border-gray-700 bg-[#1A1F3D] text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
          />

          {/* CNIC */}
          <input
            type="text"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            placeholder="CNIC (12345-6789012-3)"
            className="h-12 w-full rounded-md px-4 border border-gray-700 bg-[#1A1F3D] text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
          />

          {/* Blood Type */}
          <select
            name="blood"
            value={formData.blood}
            onChange={handleChange}
            className="h-12 w-full rounded-md px-4 border border-gray-700 bg-[#1A1F3D] text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
          >
            <option value="" disabled>Select Blood Type</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
              <option key={type} value={type} className="bg-[#1A1F3D]">{type}</option>
            ))}
          </select>

          {/* City */}
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="h-12 w-full rounded-md px-4 border border-gray-700 bg-[#1A1F3D] text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition"
          >
            <option value="" disabled>Select City</option>
            {["Karachi", "Lahore", "Islamabad", "Multan", "Peshawar"].map(city => (
              <option key={city} value={city} className="bg-[#1A1F3D]">{city}</option>
            ))}
          </select>

          {/* Address */}
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="h-28 w-full rounded-md px-4 py-2 border border-gray-700 bg-[#1A1F3D] text-white placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition resize-none"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors mt-2"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 Hope Drip. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Donor;
