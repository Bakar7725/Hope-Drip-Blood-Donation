import React, { useEffect, useState } from 'react';
import { Clock, User, Droplets, ArrowRight, X } from 'lucide-react';

// MOCK DATA
const MOCK_HISTORY = [
    { id: 101, date: '2024-10-25', donorName: 'Michael P.', donorId: 'DNR-6270', patientName: 'Jane D.', patientId: 'PAT-0045', bloodType: 'O-' },
    { id: 102, date: '2024-10-18', donorName: 'Sarah K.', donorId: 'DNR-4921', patientName: 'Robert L.', patientId: 'PAT-0112', bloodType: 'O+' },
    { id: 103, date: '2024-09-01', donorName: 'David H.', donorId: 'DNR-8105', patientName: 'Emily R.', patientId: 'PAT-0099', bloodType: 'A+' },
    { id: 104, date: '2024-08-15', donorName: 'Anna B.', donorId: 'DNR-3389', patientName: 'Alex Z.', patientId: 'PAT-0021', bloodType: 'A-' },
    { id: 105, date: '2024-07-22', donorName: 'Chris M.', donorId: 'DNR-7012', patientName: 'Taylor G.', patientId: 'PAT-0078', bloodType: 'B+' },
];

// Single History Item
const HistoryItem = ({ item }) => (
    <div className="relative pl-10 sm:pl-16 group">
        <div className="absolute top-0 left-2 sm:left-4 h-full w-0.5 bg-red-200 group-last:h-10"></div>
        <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 text-white shadow-lg z-10">
            <Droplets size={16} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 mb-8 hover:shadow-lg transition duration-300">
            <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock size={16} className="mr-2 text-red-400" />
                <span className="font-semibold">{item.date}</span>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 border-t border-b py-3">
                <div className="flex flex-col items-center text-center">
                    <User size={20} className="text-red-500 mb-1" />
                    <p className="text-sm font-bold text-gray-800">{item.donorName}</p>
                    <p className="text-xs text-gray-500">Donor ({item.donorId})</p>
                </div>

                <div className="flex flex-col items-center justify-center h-full text-center">
                    <ArrowRight size={24} className="text-teal-500" />
                    <span className="text-2xl font-extrabold text-red-600 mt-1">{item.bloodType}</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    <User size={20} className="text-blue-500 mb-1" />
                    <p className="text-sm font-bold text-gray-800">{item.patientName}</p>
                    <p className="text-xs text-gray-500">Patient ({item.patientId})</p>
                </div>
            </div>

            <p className="mt-3 text-sm text-gray-700 italic">
                <span className="font-medium text-red-600">{item.bloodType}</span> donation successfully recorded from {item.donorName} to patient {item.patientName} on {item.date}.
            </p>
        </div>
    </div>
);

// Modal Component
const DonationHistoryLogModal = ({ onClose }) => {
    const [history, setHistory] = useState(MOCK_HISTORY);

    // Prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4">
            <div className="bg-gray-50 max-w-4xl w-full rounded-xl shadow-2xl p-6 relative">
                
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-red-500 pb-2 inline-block">
                        Donation Audit Log
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        A chronological record of successful blood transfers between donors and patients.
                    </p>
                </header>

                {/* Timeline */}
                <div className="timeline max-h-[70vh] overflow-y-auto pr-2">
                    {history.map(item => <HistoryItem key={item.id} item={item} />)}
                </div>

                <footer className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">End of history log. Data is anonymized for privacy.</p>
                </footer>
            </div>
        </div>
    );
};

export default DonationHistoryLogModal;
