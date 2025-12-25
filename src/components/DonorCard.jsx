import React, { useState } from 'react';
import { Droplet, User, MapPin, Home, Clock } from 'lucide-react';

const PatientRequestCard = ({ patientData }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestClick = () => {
    setIsRequesting(true);
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
      </div>

      {/* Button */}
      <div className="mt-auto">
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
            border-2

            ${isRequesting
              ? 'bg-gray-600 border-gray-600 text-gray-300 cursor-not-allowed'
              : `
                  bg-[#BFCFC4]
                  text-[#242331]
                  border-[#BFCFC4]

                  hover:bg-red-600
                  hover:text-white
                  hover:border-red-600
                  hover:shadow-lg
                  hover:shadow-red-500/30
                `
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