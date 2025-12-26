import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Alert,
    LinearProgress,
    Card,
    CardContent
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import DonorComponent from './DonorComponent';
import PatientComponent from './PatientComponent';

const PersonalInformation = ({ userId, onClose }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();

        // Listen for user profile updates
        const handleUserUpdate = (event) => {
            if (event.detail) {
                setUserData(event.detail);
            }
        };

        window.addEventListener('userProfileUpdated', handleUserUpdate);
        return () => window.removeEventListener('userProfileUpdated', handleUserUpdate);
    }, [userId]);

    const fetchUserData = async () => {
        try {
            // ✅ FIRST: Check localStorage for immediate data
            const localUser = JSON.parse(localStorage.getItem('user'));

            if (localUser && localUser.id === userId) {
                setUserData(localUser);
            }

            // ✅ THEN: Fetch from API for latest data
            const response = await axios.get(`http://localhost:8789/user-profile/${userId}`);
            if (response.data.success) {
                const apiUser = response.data.user;

                // ✅ COMBINE LOCALSTORAGE WITH API DATA
                const combinedUser = {
                    ...localUser,
                    ...apiUser
                };

                // ✅ UPDATE LOCALSTORAGE WITH LATEST DATA
                localStorage.setItem('user', JSON.stringify(combinedUser));

                setUserData(combinedUser);
            } else {
                setError('Failed to load user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);

            // ✅ FALLBACK TO LOCALSTORAGE IF API FAILS
            const localUser = JSON.parse(localStorage.getItem('user'));
            if (localUser && localUser.id === userId) {
                setUserData(localUser);
            } else {
                setError('Unable to load personal information');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', p: 3 }}>
                <LinearProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">User data not found</Alert>
            </Box>
        );
    }

    // ✅ IMPORTANT: Check both database and localStorage values
    const isDonor = (userData.donor === 1) || (userData.donor === true);
    const isPatient = (userData.patient === 1) || (userData.patient === true);

    console.log('User Data Check:', {
        userData,
        isDonor,
        isPatient,
        donorValue: userData.donor,
        patientValue: userData.patient
    });

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Personal Information
                        </Typography>
                        {onClose && (
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                size="small"
                            >
                                Close
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon />
                            <Typography variant="body1" fontWeight="medium">
                                {userData.name || 'No Name'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalHospitalIcon />
                            <Typography variant="body2" color="text.secondary">
                                {isDonor && isPatient ? 'Donor & Patient' :
                                    isDonor ? 'Donor' :
                                        isPatient ? 'Patient' : 'User'}
                            </Typography>
                        </Box>
                        {isDonor && userData.blood_group && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BloodtypeIcon />
                                <Typography variant="body2" color="error">
                                    {userData.blood_group}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Show Donor Component if user is donor */}
            {isDonor && (
                <Box sx={{ mb: 3 }}>
                    <DonorComponent userId={userId} />
                </Box>
            )}

            {/* Show Patient Component if user is patient */}
            {isPatient && (
                <Box sx={{ mb: 3 }}>
                    <PatientComponent userId={userId} />
                </Box>
            )}

            {/* Show message if user is neither donor nor patient */}
            {!isDonor && !isPatient && (
                <Alert severity="info">
                    You are not registered as a donor or patient. Please complete your registration to access more features.
                </Alert>
            )}
        </Box>
    );
};

export default PersonalInformation;