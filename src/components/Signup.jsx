// components/SignupModal.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplet } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import OTPVerification from "./OTPVerification.jsx";

function SignupModal({ onClose, onShowSignin }) {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  
  // OTP states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userDataForOTP, setUserDataForOTP] = useState(null);

  function GetCities() {
    axios.get("http://localhost:5000/cities").then(function (result) {
      setCities(result.data);
    });
  }

  useEffect(function () {
    GetCities();
  }, []);

    function registerUser() {
    if (!checkForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const userData = {
      name: name,
      username: username,
      cnic: cnic,
      email: email,
      phone: phone,
      password: password,
      province: selectedProvince,
      city: selectedCity
    };

    // Check if user already exists
    axios.post("http://localhost:5000/check-user-exists", {
      email: email,
      phone: phone, 
      username: username,
      cnic: cnic
    })
    .then(function(response) {
      const data = response.data;
      
      if (data.exists) {
        let errorMsg = "❌ ";
        if (data.emailExists) errorMsg += "Email already exists. ";
        if (data.phoneExists) errorMsg += "Phone already exists. ";
        if (data.usernameExists) errorMsg += "Username already exists. ";
        if (data.cnicExists) errorMsg += "CNIC already registered. ";
        
        setErrorMessage(errorMsg);
        setLoading(false);
        return;
      }

      // ✅ CHANGE 1: Send OTP via EMAIL instead of phone
      return axios.post("http://localhost:5000/send-otp", { 
        email: email,    // ✅ Email bhejo
        phone: phone     // Optional: agar server ko dono chahiye
      });
    })
    .then(function(otpResponse) {
      if (otpResponse && otpResponse.data.success) {
        setUserDataForOTP(userData);
        setShowOTPModal(true);
        setErrorMessage("✅ OTP sent to your email! Check your inbox."); // ✅ Message change
      }
    })
    .catch(function(error) {
      if (error.response) {
        setErrorMessage("❌ " + (error.response.data.message || "Failed to send OTP"));
      } else {
        setErrorMessage("❌ Network error. Please check your connection.");
      }
    })
    .finally(function() {
      setLoading(false);
    });
  }

  const handleOTPVerify = async (user) => {
    setErrorMessage("✅ Registration successful! Email verified."); // ✅ Message change
    setShowOTPModal(false);
    
    setTimeout(function() {
      onClose();
    }, 3000);
  };

  // ✅ CHANGE 2: Resend function email accept kare
  const handleOTPResend = async (email) => { // ✅ Parameter change from phoneNumber to email
    try {
      const response = await axios.post("http://localhost:5000/resend-otp", {
        email: email  // ✅ Email bhejo
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to resend OTP');
    }
  };


  
  const provinces = [...new Set(cities.map(city => city.province))];
  const filteredCities = cities.filter(function (city) {
    return city.province === selectedProvince;
  });

  function createCityOptions() {
    return filteredCities.map(function (city, index) {
      return (
        <option key={index} value={city.city_name}>
          {city.city_name}
        </option>
      );
    });
  }

  function checkForm() {
    if (name === "" || username === "" || cnic === "" || email === "" || phone === "" || password === "") {
      setErrorMessage("❌ Please fill all fields");
      return false;
    }

    if (cnic.length !== 15) {
      setErrorMessage("❌ CNIC must be 13 digits with dashes: 34101-1234567-1");
      return false;
    }

    if (!email.includes("@gmail.com")) {
      setErrorMessage("❌ Email must be @gmail.com");
      return false;
    }

    if (phone.length !== 11 || !phone.startsWith("03")) {
      setErrorMessage("❌ Phone must be 11 digits starting with 03");
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("❌ Password must be at least 8 characters");
      return false;
    }

    if (selectedProvince === "" || selectedCity === "") {
      setErrorMessage("❌ Please select province and city");
      return false;
    }

    setErrorMessage("✅ All fields are valid! Sending OTP...");
    return true;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#0f1f1f] p-8 rounded-xl w-full max-w-lg md:max-w-[700px] relative shadow-2xl border border-[#c2d8c430]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#c2d8c4] transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-2 mb-8">
            <Droplet size={36} className="text-[#c2d8c4]" />
            <h2 className="text-3xl font-extrabold text-[#c2d8c4]">Create Account</h2>
            <p className="text-gray-400 text-sm">Join Hope Drip today and start contributing</p>
          </div>
          
          {errorMessage && (
            <div className={`text-center mb-4 p-3 rounded-md font-medium ${
              errorMessage.startsWith("✅") 
                ? "bg-green-700/30 text-green-300" 
                : "bg-red-700/30 text-red-300"
            }`}>
              {errorMessage}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />

            <input
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create Username"
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />

            <input
              name="cnic"
              type="text"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="CNIC (e.g., 34101-2774823-5)"
              maxLength={15}
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />

            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />

            <input
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number (03XXXXXXXXX)"
              maxLength={11}
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />

            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min. 8 characters)"
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 focus:border-[#c2d8c4] focus:ring-1 focus:ring-[#c2d8c4] focus:outline-none text-white transition-shadow"
            />
            
            <select
              name="province"
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 text-white appearance-none cursor-pointer"
            >
              <option value="">Select Province</option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>{province}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              name="city"
              className="p-3 rounded-lg bg-[#132222] border border-gray-600 text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select City</option>
              {createCityOptions()}
            </select>
          </div>

          <div className="flex justify-center mt-8">
            <motion.button
              onClick={registerUser}
              disabled={loading}
              className="bg-[#c2d8c4] text-[#0f1f1f] font-bold px-12 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Sending OTP..." : "Send OTP & Sign Up"}
            </motion.button>
          </div>

          <div className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => {
                onClose();
                onShowSignin();
              }}
              className="text-[#c2d8c4] font-semibold hover:underline transition-colors"
            >
              Log in
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-8">
            © 2025 Hope Drip. All rights reserved.
          </div>
        </motion.div>
      </div>

      <OTPVerification
        phoneNumber={phone}
        userData={userDataForOTP}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => setShowOTPModal(false)}
        isOpen={showOTPModal}
      />
    </>
  );
}

export default SignupModal;