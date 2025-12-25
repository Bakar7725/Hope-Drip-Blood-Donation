import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Bell,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    MapPin,
    Phone,
    Calendar,
    X,
    ChevronRight,
    Filter
} from 'lucide-react';

const PatientNotifications = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'accepted', 'rejected'

    useEffect(() => {
        fetchPatientRequests();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchPatientRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchPatientRequests = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || userData.patient !== 1) {
                setRequests([]);
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:8789/patient-requests/${userData.id}`);

            if (response.data.success) {
                // Sort requests: inprogress first, then recent first
                const sortedRequests = response.data.requests.sort((a, b) => {
                    if (a.request_status === 'inprogress' && b.request_status !== 'inprogress') return -1;
                    if (a.request_status !== 'inprogress' && b.request_status === 'inprogress') return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                setRequests(sortedRequests);
            }
        } catch (error) {
            console.error('Error fetching patient requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return;

        try {
            const userData = JSON.parse(localStorage.getItem('user'));

            const response = await axios.put(`http://localhost:8789/cancel-request/${requestId}`, {
                patient_id: userData.id
            });

            if (response.data.success) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req.Red_id === requestId
                        ? { ...req, request_status: 'cancelled', updated_at: new Date().toISOString() }
                        : req
                ));
                alert('Request cancelled successfully');
            }
        } catch (error) {
            console.error('Error cancelling request:', error);
            alert('Failed to cancel request');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateTime = (dateString) => {
        return `${formatDate(dateString)} at ${formatTime(dateString)}`;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'inprogress':
                return <Clock size={16} className="text-yellow-500 animate-pulse" />;
            case 'accepted':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'rejected':
                return <XCircle size={16} className="text-red-500" />;
            case 'timeout':
                return <AlertCircle size={16} className="text-gray-500" />;
            case 'cancelled':
                return <X size={16} className="text-orange-500" />;
            default:
                return <Bell size={16} className="text-blue-500" />;
        }
    };

    const getStatusText = (status, minutesLeft) => {
        switch (status) {
            case 'inprogress':
                return minutesLeft > 0
                    ? `Waiting (${minutesLeft}m left)`
                    : 'Waiting for response';
            case 'accepted':
                return 'Accepted ✓';
            case 'rejected':
                return 'Rejected ✗';
            case 'timeout':
                return 'Timeout';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const viewRequestDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const getAcceptedCount = () => {
        return requests.filter(r => r.request_status === 'accepted').length;
    };

    const getActiveCount = () => {
        return requests.filter(r => r.request_status === 'inprogress').length;
    };

    const filteredRequests = () => {
        switch (filter) {
            case 'active':
                return requests.filter(r => r.request_status === 'inprogress');
            case 'accepted':
                return requests.filter(r => r.request_status === 'accepted');
            case 'rejected':
                return requests.filter(r => r.request_status === 'rejected' || r.request_status === 'timeout' || r.request_status === 'cancelled');
            default:
                return requests;
        }
    };

    const getFilteredCount = () => {
        return filteredRequests().length;
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                        <Bell size={18} />
                        My Blood Requests
                    </h3>
                    <div className="flex gap-2">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            {getAcceptedCount()} Accepted
                        </span>
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                            {getActiveCount()} Active
                        </span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm">
                    Track all your blood donation requests
                </p>

                {/* Filter Tabs */}
                <div className="flex gap-1 mt-3">
                    {['all', 'active', 'accepted', 'rejected'].map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${filter === filterType
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="px-4 py-3 bg-gray-800/30 border-b border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-2xl font-bold text-white">{requests.length}</p>
                        <p className="text-xs text-gray-400">Total</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-400">{getAcceptedCount()}</p>
                        <p className="text-xs text-gray-400">Accepted</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-400">{getActiveCount()}</p>
                        <p className="text-xs text-gray-400">Active</p>
                    </div>
                </div>
            </div>

            {/* Requests List */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-2">Loading your requests...</p>
                    </div>
                ) : getFilteredCount() === 0 ? (
                    <div className="p-6 text-center">
                        <Bell size={32} className="text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">
                            {filter === 'all'
                                ? 'No blood requests sent yet'
                                : `No ${filter} requests found`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {filter === 'all'
                                ? 'Visit Donors page to request blood'
                                : 'Try changing the filter'}
                        </p>
                    </div>
                ) : (
                    filteredRequests().map((request) => (
                        <div
                            key={request.Red_id}
                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${request.request_status === 'accepted' ? 'bg-green-900/10' :
                                    request.request_status === 'inprogress' ? 'bg-yellow-900/10' :
                                        request.request_status === 'rejected' ? 'bg-red-900/10' :
                                            request.request_status === 'cancelled' ? 'bg-orange-900/10' : ''
                                }`}
                            onClick={() => viewRequestDetails(request)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(request.request_status)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-white flex items-center gap-2">
                                                <User size={14} />
                                                {request.donor_name}
                                            </h4>
                                            <p className="text-gray-400 text-xs mt-1">
                                                Blood: <span className="text-red-300 font-semibold">{request.donor_blood_group}</span>
                                                {request.donor_city && ` • ${request.donor_city}`}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(request.request_status)}`}>
                                            {getStatusText(request.request_status, request.minutes_left)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            <Calendar size={12} />
                                            {formatDate(request.created_at)}
                                        </div>

                                        {/* Action buttons based on status */}
                                        <div className="flex gap-2">
                                            {request.request_status === 'inprogress' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        cancelRequest(request.Red_id);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {request.request_status === 'accepted' && (
                                                <div className="flex items-center gap-1 text-green-400 text-xs">
                                                    <Phone size={12} />
                                                    Contact
                                                </div>
                                            )}

                                            <ChevronRight size={14} className="text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-800/50 border-t border-gray-700 flex justify-between">
                <button
                    onClick={fetchPatientRequests}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <div className="text-gray-400 text-sm">
                    Showing {getFilteredCount()} of {requests.length} requests
                </div>
            </div>

            {/* Request Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg w-full max-w-md border border-gray-700 max-h-[80vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-white text-lg">Request Details</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Donor Info */}
                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                                    <User size={16} />
                                    Donor Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white">{selectedRequest.donor_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Blood Group:</span>
                                        <span className="text-red-300 font-semibold">{selectedRequest.donor_blood_group}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">City:</span>
                                        <span className="text-white">{selectedRequest.donor_city || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Contact:</span>
                                        <span className="text-blue-300">{selectedRequest.donor_phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Request Timeline */}
                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-white mb-3">Request Timeline</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-white text-sm">Request Sent</p>
                                            <p className="text-gray-400 text-xs">
                                                {formatDateTime(selectedRequest.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedRequest.expires_at && (
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${selectedRequest.request_status === 'inprogress' ? 'bg-yellow-500' : 'bg-gray-500'
                                                }`}></div>
                                            <div>
                                                <p className="text-white text-sm">Response Deadline</p>
                                                <p className="text-gray-400 text-xs">
                                                    {formatDateTime(selectedRequest.expires_at)}
                                                </p>
                                                {selectedRequest.minutes_left > 0 && (
                                                    <p className="text-yellow-400 text-xs">
                                                        {selectedRequest.minutes_left} minutes remaining
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${getStatusDotColor(selectedRequest.request_status)}`}></div>
                                        <div>
                                            <p className="text-white text-sm">Current Status</p>
                                            <p className={`text-sm ${getStatusTextColor(selectedRequest.request_status)}`}>
                                                {getStatusText(selectedRequest.request_status, selectedRequest.minutes_left)}
                                            </p>
                                            {selectedRequest.updated_at && (
                                                <p className="text-gray-400 text-xs">
                                                    Last updated: {formatDateTime(selectedRequest.updated_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {selectedRequest.request_status === 'inprogress' && (
                                    <button
                                        onClick={() => {
                                            cancelRequest(selectedRequest.Red_id);
                                            setShowDetailModal(false);
                                        }}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel Request
                                    </button>
                                )}

                                {selectedRequest.request_status === 'accepted' && (
                                    <button
                                        onClick={() => {
                                            alert(`Contact donor: ${selectedRequest.donor_name}\nPhone: ${selectedRequest.donor_phone}`);
                                        }}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Contact Donor
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
        case 'cancelled':
            return 'bg-orange-900/30 text-orange-300';
        default:
            return 'bg-gray-700 text-gray-300';
    }
};

const getStatusDotColor = (status) => {
    switch (status) {
        case 'inprogress':
            return 'bg-yellow-500';
        case 'accepted':
            return 'bg-green-500';
        case 'rejected':
            return 'bg-red-500';
        case 'timeout':
            return 'bg-gray-500';
        case 'cancelled':
            return 'bg-orange-500';
        default:
            return 'bg-gray-500';
    }
};

const getStatusTextColor = (status) => {
    switch (status) {
        case 'inprogress':
            return 'text-yellow-300';
        case 'accepted':
            return 'text-green-300';
        case 'rejected':
            return 'text-red-300';
        case 'timeout':
            return 'text-gray-300';
        case 'cancelled':
            return 'text-orange-300';
        default:
            return 'text-gray-300';
    }
};

export default PatientNotifications;