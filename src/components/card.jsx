import React, { useState } from 'react';
import { Droplet, User, MapPin, Home, Clock } from 'lucide-react';

// This data would typically come from props in a real application
const PatientRequestCard = ({ patientData }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestClick = () => {
    setIsRequesting(true);
    // In a real app, you would make an API call here.
  };

  return (
    // Max width set to 'xs' (extra small) for a smaller card that fits 4 in a row.
    // Padding and spacing adjusted for the new size.
    <div className="bg-[#2C2B3C] w-full max-w-xs rounded-lg shadow-xl p-5 text-white flex flex-col">
      
      {/* Top Section: Blood Group (top-left) and Profile Icon */}
      <div className="relative flex justify-center mb-6 pt-4"> {/* Added pt-4 to account for absolute positioning */}
        {/* Blood Group Badge (Top-Left Absolute Positioned) */}
        <div className="
          absolute -top-3 -left-3 
          flex items-center gap-1
          bg-red-800 
          px-3 py-1.5 
          rounded-full
          text-sm font-semibold 
          flex-shrink-0
          z-10
        ">
          <Droplet size={14} className="text-red-200" fill="currentColor" />
          <span className="text-white text-base">
            {patientData.bloodGroup}
          </span>
        </div>

        {/* Profile Icon (Centered at the top) */}
        <div className="bg-[#242331] p-3 rounded-full">
          <User size={36} className="text-[#BFCFC4]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Patient Name & Username */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-white leading-tight">
          {patientData.name}
        </h2>
        <p className="text-xs text-gray-400">
          @{patientData.username}
        </p>
      </div>

      {/* Card Body: Details */}
      <div className="space-y-3 mb-6 flex-grow"> {/* flex-grow to push button to bottom */}
        {/* City */}
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-[#BFCFC4] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-300 text-sm">City</p>
            <p className="text-gray-100 text-sm">{patientData.city}</p>
          </div>
        </div>
        {/* Address */}
        <div className="flex items-start gap-2">
          <Home size={18} className="text-[#BFCFC4] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-300 text-sm">Address</p>
            <p className="text-gray-100 text-sm leading-snug">{patientData.address}</p>
          </div>
        </div>
      </div>

      {/* Card Footer: The Button */}
      <div className="mt-auto"> {/* mt-auto to push button to the very bottom */}
        <button
          onClick={handleRequestClick}
          disabled={isRequesting}
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
            ${isRequesting 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-[#BFCFC4] text-[#242331] hover:bg-opacity-80'
            }
          `}
        >
          {isRequesting ? (
            <>
              <Clock size={18} className="animate-spin" />
              <span>Request in progress</span>
            </>
          ) : (
            <span>Request</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PatientRequestCard;