import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import logo from "./images/1.png";

export default function SignupModal({ onClose, onShowSignin }) {
  // ✅ Dummy data for provinces and cities
  const provinces = ["Punjab", "Sindh", "KPK", "Balochistan"];
  const cities = [
    { city_name: "Lahore", province: "Punjab" },
    { city_name: "Karachi", province: "Sindh" },
    { city_name: "Islamabad", province: "KPK" },
    { city_name: "Quetta", province: "Balochistan" },
    { city_name: "Faisalabad", province: "Punjab" },
    { city_name: "Hyderabad", province: "Sindh" },
  ];

  const [filteredCities, setFilteredCities] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    cnic: "",
    email: "",
    phone: "",
    password: "",
    province: "",
    city: "",
  });

  // ✅ Filter cities when province changes
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({ ...formData, province: selectedProvince, city: "" });
    const filtered = cities.filter(
      (city) => city.province.toLowerCase() === selectedProvince.toLowerCase()
    );
    setFilteredCities(filtered);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Signup (dummy)
  const handleSignup = () => {
    console.log("Signup Data:", formData);
    alert("✅ User registered successfully! (dummy)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0f1f1f] p-8 rounded-lg w-[700px] relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={logo} alt="Hope Drip" className="w-9 h-8" />
          <h2 className="text-2xl font-bold text-[#c2d8c4]">Create Account</h2>
          <p className="text-gray-400 text-sm">Join Hope Drip today</p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="fullname"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            name="username"
            type="text"
            placeholder="Create Username"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            name="cnic"
            type="text"
            placeholder="CNIC"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:outline-none text-white"
          />

          {/* Province Dropdown */}
          <select
            name="province"
            onChange={handleProvinceChange}
            value={formData.province}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 text-white"
          >
            <option value="">Select Province</option>
            {provinces.map((prov, index) => (
              <option key={index} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            name="city"
            onChange={handleChange}
            value={formData.city}
            className="p-2 rounded-md bg-[#132222] border border-gray-600 text-white"
          >
            <option value="">Select City</option>
            {filteredCities.map((city, index) => (
              <option key={index} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSignup}
            className="bg-[#c2d8c4] text-[#0f1f1f] font-semibold px-8 py-2 rounded-md hover:bg-[#a8c4a9] transition"
          >
            Sign Up
          </button>
        </div>

        {/* Switch to Sign In */}
        <div className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <button
           onClick={() => {
            onClose();        // Close Signup
            onShowSignin();   // Open Signin
          }}
            className="text-[#c2d8c4] hover:underline"
          >
            Log in
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          © 2025 Hope Drip. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}
