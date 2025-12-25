import React, { useState, useEffect } from 'react';
import { Droplet, User, MapPin, Home, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const PatientRequestCard = ({ patientData }) => {
  const [requestStatus, setRequestStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Check if user is logged in and is a patient
  useEffect(() => {
    checkRequestStatus();

    // If request is in progress, start countdown timer
    if (requestStatus === 'inprogress' && requestId) {
      startCountdownTimer();
    }
  }, [patientData.id]);

  const checkRequestStatus = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || userData.patient !== 1) {
        return;
      }

      const response = await axios.get('http://localhost:8789/check-request', {
        params: {
          donor_id: patientData.id,
          patient_id: userData.id
        }
      });

      if (response.data.exists) {
        // ✅ KEY CHANGE: Agar request timeout, rejected ya cancelled hai, to status clear kar do
        if (response.data.status === 'timeout' ||
          response.data.status === 'rejected' ||
          response.data.status === 'cancelled') {
          setRequestStatus(''); // Clear status, show normal button
          setRequestId(null);
          setTimeLeft(null);
        } else {
          setRequestStatus(response.data.status);
          setRequestId(response.data.request_id);

          if (response.data.expires_at) {
            const expires = new Date(response.data.expires_at);
            const now = new Date();
            const diff = Math.max(0, Math.floor((expires - now) / 1000 / 60)); // minutes
            setTimeLeft(diff);
          }
        }
      } else {
        setRequestStatus('');
        setRequestId(null);
        setTimeLeft(null);
      }
    } catch (error) {
      console.error('Error checking request status:', error);
      setRequestStatus(''); // On error, show button
    }
  };

  const startCountdownTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          checkRequestStatus(); // Refresh status
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute
  };

  const handleRequestClick = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Check if user is logged in
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        setMessage('Please login first');
        return;
      }

      // Check if user is registered as patient
      if (userData.patient !== 1) {
        setMessage('You need to register as a patient first');
        return;
      }

      // Check if there's already an active request
      if (requestStatus === 'inprogress') {
        setMessage('Request already in progress');
        return;
      }

      // ✅ No need to check for rejected/timeout - directly send new request
      // Send request to backend
      const response = await axios.post('http://localhost:8789/create-request', {
        donor_id: patientData.id,
        patient_id: userData.id
      });

      if (response.data.success) {
        setRequestStatus('inprogress');
        setRequestId(response.data.request_id);
        setShowPopup(true);
        setMessage('');

        // Start countdown timer
        setTimeLeft(30); // 30 minutes
        startCountdownTimer();

        // Hide popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      } else {
        setMessage(response.data.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get button text - ONLY show status for ACTIVE requests
  const getButtonText = () => {
    switch (requestStatus) {
      case 'inprogress':
        return timeLeft ? `In Progress (${timeLeft}m)` : 'Request in Progress';
      case 'accepted':
        return 'Request Accepted ✓';
      // ✅ Timeout, Rejected, Cancelled ke liye normal button text
      default:
        return '🩸 Request Blood';
    }
  };

  // ✅ Get button color - ONLY special colors for ACTIVE requests
  const getButtonColor = () => {
    switch (requestStatus) {
      case 'inprogress':
        return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600';
      case 'accepted':
        return 'bg-green-600 hover:bg-green-700 border-green-600';
      // ✅ Default RED color for all other cases (including timeout/rejected)
      default:
        return 'bg-red-600 hover:bg-red-700 border-red-600';
    }
  };

  // ✅ Check if button should be disabled
  const isButtonDisabled = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    // ✅ ONLY disable for inprogress or accepted requests
    const disableForStatus = requestStatus === 'inprogress' || requestStatus === 'accepted';

    return loading || disableForStatus || !userData || userData.patient !== 1;
  };

  // ✅ Get status icon - ONLY for active requests
  const getStatusIcon = () => {
    switch (requestStatus) {
      case 'inprogress':
        return <Clock size={18} className="animate-pulse" />;
      case 'accepted':
        return <CheckCircle size={18} />;
      // ✅ No icons for timeout/rejected/cancelled
      default:
        return null;
    }
  };

  return (
    <div
      className="
        group
        bg-[#2C2B3C]
        w-full max-w-xs
        rounded-lg
        shadow-xl
        p-5
        text-white
        flex flex-col
        transition-all
        duration-300
        ease-out
        hover:-translate-y-2
        hover:shadow-2xl
        hover:shadow-red-500/20
        hover:border
        hover:border-red-600
      "
    >
      {/* Top Section */}
      <div className="relative flex justify-center mb-6 pt-4">
        {/* Blood Group Badge */}
        <div
          className="
            absolute -top-3 -left-3
            flex items-center gap-1
            bg-red-600
            px-3 py-1.5
            rounded-full
            text-sm font-semibold
            z-10
            transition
            duration-300
            group-hover:scale-110
            group-hover:bg-red-700
          "
        >
          <Droplet size={14} className="text-red-200" fill="currentColor" />
          <span className="text-white text-base">
            {patientData.bloodGroup}
          </span>
        </div>

        {/* Profile Icon */}
        <div
          className="
            bg-[#242331]
            p-3
            rounded-full
            transition
            duration-300
            group-hover:scale-110
            group-hover:bg-[#2F2E3E]
          "
        >
          <User size={36} className="text-[#BFCFC4]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-5">
        <h2
          className="
            text-xl
            font-bold
            text-white
            leading-tight
            transition
            duration-300
            group-hover:text-red-400
          "
        >
          {patientData.name}
        </h2>
        <p className="text-xs text-gray-400">
          @{patientData.username}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-[#BFCFC4] mt-0.5" />
          <div>
            <p className="font-semibold text-gray-300 text-sm">City</p>
            <p className="text-gray-100 text-sm">{patientData.city}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Home size={18} className="text-[#BFCFC4] mt-0.5" />
          <div>
            <p className="font-semibold text-gray-300 text-sm">Address</p>
            <p className="text-gray-100 text-sm leading-snug">
              {patientData.address}
            </p>
          </div>
        </div>

        {/* ✅ Status Display - ONLY for ACTIVE requests */}
        {(requestStatus === 'inprogress' || requestStatus === 'accepted') && (
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className={`flex items-center gap-2 ${getStatusColor(requestStatus)}`}>
              {getStatusIcon()}
              <span className="font-semibold capitalize">
                {requestStatus}
                {requestStatus === 'inprogress' && timeLeft && ` (${timeLeft} minutes left)`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-auto">
        <button
          onClick={handleRequestClick}
          disabled={isButtonDisabled()}
          className={`
            w-full
            font-bold
            py-2.5
            px-5
            rounded-lg
            transition-all
            duration-300
            flex
            items-center
            justify-center
            gap-2
            text-base
            border-2
            ${getButtonColor()}
            ${isButtonDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-red-500/30'}
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              {getStatusIcon()}
              <span>{getButtonText()}</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {message && (
          <div className="mt-2 p-2 bg-red-900/50 border border-red-700 text-red-300 rounded text-sm">
            {message}
          </div>
        )}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1a1a2e] rounded-lg p-6 max-w-sm mx-4 border border-green-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Sent Successfully! 🎉</h3>
              <p className="text-gray-300 mb-4">
                Your blood request has been sent to <strong className="text-green-300">{patientData.name}</strong>.
              </p>
              <div className="bg-gray-800/50 p-3 rounded mb-4">
                <p className="text-yellow-300 text-sm">
                  ⏰ <strong>30 Minutes Timer Started</strong>
                </p>
                <p className="text-gray-400 text-xs">
                  The donor has 30 minutes to respond. You'll be notified when they accept or reject.
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'inprogress':
      return 'text-yellow-400';
    case 'accepted':
      return 'text-green-400';
    // ✅ No colors for terminal states
    default:
      return 'text-gray-400';
  }
};

export default PatientRequestCard;