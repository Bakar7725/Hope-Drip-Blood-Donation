import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationBadge = ({ patientId }) => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (patientId) {
            fetchPendingRequestsCount();
            // Refresh every 30 seconds
            const interval = setInterval(fetchPendingRequestsCount, 30000);
            return () => clearInterval(interval);
        }
    }, [patientId]);

    const fetchPendingRequestsCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8789/patient-request-stats/${patientId}`);
            if (response.data.success) {
                setPendingCount(response.data.stats.active || 0);
            }
        } catch (error) {
            console.error('Error fetching pending requests count:', error);
        }
    };

    // If no pending requests, don't show badge
    if (pendingCount === 0) return null;

    return (
        <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center"
            title={`${pendingCount} active request${pendingCount > 1 ? 's' : ''}`}
        >
            <span className="text-white text-xs font-bold">
                {pendingCount > 9 ? '9+' : pendingCount}
            </span>
        </span>
    );
};

export default NotificationBadge;