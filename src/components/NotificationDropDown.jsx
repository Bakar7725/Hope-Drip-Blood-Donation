import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const NotificationDropdown = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonorRequests();
    }, []);

    const fetchDonorRequests = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) return;

            const response = await axios.get(`http://localhost:8789/donor-requests/${userData.id}`);

            if (response.data.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching donor requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // In NotificationDropdown.jsx, update the handleRequestAction function:

    const handleRequestAction = async (requestId, action) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));

            // درخواست کو requests array میں تلاش کریں
            const request = requests.find(r => r.Red_id === requestId);

            if (!request) {
                alert('Request not found');
                return;
            }

            if (action === 'accepted') {
                // Use the new API that automatically cancels other requests
                const response = await axios.post('http://localhost:8789/accept-and-cancel-others', {
                    request_id: requestId,
                    donor_id: userData.id,
                    patient_id: request.patient_id // ✅ اب patient_id دستیاب ہے
                });

                if (response.data.success) {
                    alert(`✅ Request accepted. ${response.data.cancelled_count} other requests from this patient were cancelled.`);
                    fetchDonorRequests();
                }
            } else {
                // For reject, use the old API
                const response = await axios.put(`http://localhost:8789/update-request/${requestId}`, {
                    status: action,
                    donor_id: userData.id
                });

                if (response.data.success) {
                    fetchDonorRequests();
                }
            }
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Failed to process request');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'inprogress':
                return <Clock size={16} className="text-yellow-500" />;
            case 'accepted':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'rejected':
                return <XCircle size={16} className="text-red-500" />;
            case 'timeout':
                return <AlertCircle size={16} className="text-gray-500" />;
            default:
                return <Bell size={16} />;
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Blood Requests</h3>
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {requests.filter(r => r.request_status === 'inprogress').length} New
                    </span>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-2">Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-4 text-center">
                        <Bell size={24} className="text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">No blood requests</p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <div
                            key={request.Red_id}
                            className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(request.request_status)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-white">{request.patient_name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(request.request_status)}`}>
                                            {request.request_status}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-sm mt-1">
                                        Blood Group: <span className="text-red-300">{request.blood_group}</span>
                                    </p>

                                    <p className="text-gray-500 text-xs mt-2">
                                        {request.hospital_name && `Hospital: ${request.hospital_name}`}
                                    </p>

                                    <p className="text-gray-500 text-xs">
                                        {request.medical_condition && `Condition: ${request.medical_condition.substring(0, 50)}...`}
                                    </p>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="text-xs text-gray-500">
                                            {formatTime(request.created_at)}
                                            {request.minutes_left > 0 && request.request_status === 'inprogress' && (
                                                <span className="ml-2 text-yellow-500">
                                                    ⏰ {request.minutes_left}m left
                                                </span>
                                            )}
                                        </div>

                                        {request.request_status === 'inprogress' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRequestAction(request.Red_id, 'accepted')}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(request.Red_id, 'rejected')}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-gray-800/50 border-t border-gray-700">
                <button
                    onClick={fetchDonorRequests}
                    className="text-red-400 hover:text-red-300 text-sm w-full text-center py-2"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'inprogress':
            return 'bg-yellow-900/30 text-yellow-300';
        case 'accepted':
            return 'bg-green-900/30 text-green-300';
        case 'rejected':
            return 'bg-red-900/30 text-red-300';
        case 'timeout':
            return 'bg-gray-700 text-gray-300';
        default:
            return 'bg-gray-700 text-gray-300';
    }
};

export default NotificationDropdown;