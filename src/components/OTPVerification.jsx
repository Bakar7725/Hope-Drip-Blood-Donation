// components/OTPVerification.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const OTPVerification = ({
  email,
  phoneNumber,
  userData,
  onVerify,
  onResend,
  onClose,
  isOpen
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');

    if (pastedOtp.every(char => /^\d*$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);

      // Focus last input after paste
      const lastFilledIndex = Math.min(pastedOtp.length - 1, 5);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // CHANGE THIS: Use the same backend port (8789)
      const response = await axios.post('http://localhost:8789/verify-otp-register', {
        email: email,
        otp: enteredOtp,
        userData: userData
      });

      if (response.data.success) {
        onVerify(response.data.user);
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      // Call the parent resend function
      await onResend(email);
      startTimer();
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Verify Email</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-center text-sm mb-1">
            We've sent a 6-digit verification code to your email
          </p>
          <p className="text-gray-900 font-semibold text-center text-lg mb-8">
            {email}
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                disabled={loading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="flex justify-between items-center">
              <button
                onClick={clearOtp}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium disabled:text-gray-400 transition-colors"
              >
                Clear OTP
              </button>

              <button
                onClick={handleResend}
                disabled={!canResend || loading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400 transition-colors"
              >
                {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;