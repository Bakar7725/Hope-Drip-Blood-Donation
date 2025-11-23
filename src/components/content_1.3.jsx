import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, XCircle, HeartPulse } from 'lucide-react';

const MOCK_DONORS = [
  { id: 'DNR-4921', bloodType: 'O+', city: 'San Francisco', address: '123 Market St, 94103', status: 'Available Now', lastDonation: '45 days ago' },
  { id: 'DNR-3389', bloodType: 'A-', city: 'San Jose', address: '45 Silicon Valley Dr, 95113', status: 'Ready Tomorrow', lastDonation: '90 days ago' },
  { id: 'DNR-7012', bloodType: 'B+', city: 'San Francisco', address: '789 Bay Bridge Rd, 94105', status: 'Available Now', lastDonation: '10 days ago' },
  // ... other donors
];

const DonorCard = ({ donor }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available Now': return { classes: 'bg-green-100 text-green-800 border-green-400', icon: CheckCircle };
      case 'Ready Tomorrow': return { classes: 'bg-yellow-100 text-yellow-800 border-yellow-400', icon: Clock };
      case 'Pending Screening': return { classes: 'bg-red-100 text-red-800 border-red-400', icon: XCircle };
      default: return { classes: 'bg-gray-100 text-gray-800 border-gray-400', icon: Clock };
    }
  };

  const statusInfo = getStatusStyle(donor.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-xl shadow-lg border-l-8 border-red-500 hover:shadow-xl transition duration-300 transform hover:scale-[1.005]">
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-center">
        <p className="text-sm font-semibold uppercase text-gray-500">Blood Type</p>
        <h3 className="text-6xl font-extrabold text-red-600 leading-none">{donor.bloodType}</h3>
      </div>
      <div className="flex-grow space-y-2 md:space-y-0 md:flex md:justify-between md:items-center w-full">
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-semibold text-gray-900">Donor ID: {donor.id}</p>
          <div className="flex items-center text-gray-600 text-sm font-bold">
            <MapPin size={16} className="text-teal-500 mr-2" />
            <span>{donor.city}</span>
          </div>
          <div className="flex items-start text-gray-600 text-sm">
            <span className="text-gray-400 mr-2 pt-0.5">•</span>
            <span className="italic">{donor.address}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm pt-1">
            <HeartPulse size={16} className="text-red-500 mr-2" />
            <span>Last Donated: {donor.lastDonation}</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end space-y-3 mt-4 md:mt-0">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${statusInfo.classes}`}>
            <StatusIcon size={14} className="mr-1" />
            {donor.status}
          </span>
          <button
            className="w-full md:w-auto px-5 py-2 text-sm font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-md transition duration-300 disabled:bg-gray-400"
            disabled={donor.status === 'Pending Screening'}
          >
            {donor.status === 'Pending Screening' ? 'Cannot Request' : 'Request Match'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DonorModal = ({ onClose }) => {
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('All');

  // Dynamically calculate available blood types and cities based on filtered donors
  const filteredDonors = MOCK_DONORS.filter(d =>
    (filterType === 'All' || d.bloodType === filterType) &&
    (filterCity === 'All' || d.city === filterCity)
  );

  const bloodTypes = ['All', ...new Set(filteredDonors.map(d => d.bloodType))];
  const cities = ['All', ...new Set(filteredDonors.map(d => d.city))];

  // --- Disable page scroll when modal is open ---
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden'; // stop body scroll
    return () => {
      document.body.style.overflow = originalStyle; // restore on close
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 w-3/4 max-w-6xl rounded-xl shadow-lg flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Matched Donors</h2>
          <button onClick={onClose} className="text-gray-700 font-bold">X</button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border-b flex flex-wrap gap-4">
          {bloodTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${filterType === type ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'}`}
            >
              {type}
            </button>
          ))}
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${filterCity === city ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-600'}`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Scrollable List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {filteredDonors.length > 0 ? (
            filteredDonors.map(donor => <DonorCard key={donor.id} donor={donor} />)
          ) : (
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <p>No matching donors found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorModal;
