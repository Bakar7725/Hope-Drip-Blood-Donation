import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Avatar,
    Button,
    Box,
    Divider,
    LinearProgress,
    Alert,
    Tooltip,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper
} from '@mui/material';
import {
    Edit as EditIcon,
    LocationOn,
    Phone,
    Email,
    Bloodtype,
    Person,
    Cake,
    Transgender,
    CheckCircle,
    History,
    Close as CloseIcon,
    Badge
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const DonorComponent = ({ userId, onClose }) => {
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [statusLoading, setStatusLoading] = useState(false);
    const [isNewDonor, setIsNewDonor] = useState(false);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genders = ['Male', 'Female', 'Other'];
    const provinces = [
        'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
        'Gilgit-Baltistan', 'Azad Jammu & Kashmir', 'Islamabad'
    ];

    useEffect(() => {
        fetchDonorData();
    }, [userId]);

    const fetchDonorData = async () => {
        try {
            const response = await axios.get(`http://localhost:8789/donor-profile/${userId}`);
            if (response.data.success) {
                const userData = response.data.user;
                setDonor(userData);
                setEditData(userData);

                // Check if user is a donor
                if (userData.donor === 1) {
                    setIsNewDonor(false);
                } else {
                    setIsNewDonor(true);
                }
            }
        } catch (error) {
            console.error('Error fetching donor data:', error);
            toast.error('Failed to load donor information');
        } finally {
            setLoading(false);
        }
    };

    const handleEditOpen = () => {
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            let response;

            if (isNewDonor) {
                // ✅ Use /register-donor for NEW donors (sets donor=1 and verification=1)
                response = await axios.post('http://localhost:8789/register-donor', {
                    userId,
                    fullName: editData.name,
                    phone: editData.phone,
                    bloodGroup: editData.blood_group,
                    age: editData.age,
                    gender: editData.gender,
                    province: editData.province,
                    city: editData.city,
                    address: editData.address
                });
            } else {
                // ✅ Use /update-personal-info for EXISTING donors
                response = await axios.post('http://localhost:8789/update-personal-info', {
                    userId,
                    fullName: editData.name,
                    phone: editData.phone,
                    bloodGroup: editData.blood_group,
                    age: editData.age,
                    gender: editData.gender,
                    province: editData.province,
                    city: editData.city,
                    address: editData.address
                });
            }

            if (response.data.success) {
                // ✅ UPDATE LOCAL STORAGE
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = {
                    ...currentUser,
                    ...response.data.user || response.data.donor,
                    donor: 1, // Ensure donor is set to 1
                    verification: 1 // Ensure verification is set to 1
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // ✅ UPDATE STATE
                setDonor(updatedUser);
                setIsNewDonor(false);

                toast.success(isNewDonor
                    ? 'Donor registration completed successfully!'
                    : 'Profile updated successfully!'
                );

                handleEditClose();

                // ✅ REFRESH AFTER A SHORT DELAY
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Save error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to save changes');
        }
    };

    const toggleStatus = async () => {
        if (!donor || donor.status === undefined) return;

        setStatusLoading(true);
        try {
            const newStatus = donor.status === 'free' ? 'busy' : 'free';
            const response = await axios.put('http://localhost:8789/update-donor-status', {
                userId,
                status: newStatus
            });

            if (response.data.success) {
                setDonor(prev => ({ ...prev, status: newStatus }));
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setStatusLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'free': return 'success';
            case 'busy': return 'warning';
            case 'active': return 'info';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'free': return 'Available for Donation';
            case 'busy': return 'Currently Busy';
            case 'active': return 'Active';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', p: 3 }}>
                <LinearProgress />
            </Box>
        );
    }

    // ✅ SHOW REGISTRATION FORM IF NOT A DONOR YET
    if (!donor || donor.donor !== 1) {
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        sx={{ width: 80, height: 80, bgcolor: '#c2185b', margin: '0 auto', mb: 2 }}
                        alt={donor?.name}
                    >
                        🩸
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Complete Donor Registration
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You need to register as a donor to access donor features and help save lives.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleEditOpen}
                        startIcon={<EditIcon />}
                        sx={{ bgcolor: '#c2185b', px: 4 }}
                    >
                        Complete Donor Registration
                    </Button>
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Why register as a donor?</strong><br />
                        • Help patients in need of blood<br />
                        • Get notified about blood requests<br />
                        • Earn recognition for your donations<br />
                        • Be part of a lifesaving community
                    </Typography>
                </Alert>
            </Paper>
        );
    }

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{ width: 70, height: 70, bgcolor: '#c2185b' }}
                            alt={donor.name}
                            src={`https://ui-avatars.com/api/?name=${donor.name}&background=c2185b&color=fff`}
                        >
                            {donor.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {donor.name}
                                {donor.verification === 1 && (
                                    <Tooltip title="Verified Donor">
                                        <CheckCircle sx={{ color: 'green', ml: 1, fontSize: 20 }} />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                @{donor.username}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip
                            label={getStatusLabel(donor.status)}
                            color={getStatusColor(donor.status)}
                            sx={{ fontWeight: 'bold', px: 2 }}
                        />

                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleEditOpen}
                            startIcon={<EditIcon />}
                            sx={{ bgcolor: '#c2185b' }}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Information Grid */}
                <Grid container spacing={3}>
                    {/* Basic Information Column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#c2185b', mb: 2 }}>
                            <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Basic Information
                        </Typography>

                        <InfoItem icon={<Bloodtype />} label="Blood Group">
                            <Chip
                                label={donor.blood_group || 'Not Specified'}
                                color="error"
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </InfoItem>

                        <InfoItem icon={<Cake />} label="Age">
                            <Typography>{donor.age || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Transgender />} label="Gender">
                            <Typography>{donor.gender || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Badge />} label="Donor ID">
                            <Typography fontFamily="monospace">DON-{donor.id.toString().padStart(6, '0')}</Typography>
                        </InfoItem>
                    </Grid>

                    {/* Contact Information Column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#c2185b', mb: 2 }}>
                            <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Contact & Location
                        </Typography>

                        <InfoItem icon={<Email />} label="Email">
                            <Typography>{donor.email}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Phone />} label="Phone">
                            <Typography>{donor.phone || 'Not Provided'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<LocationOn />} label="Location">
                            <Typography>
                                {donor.city}, {donor.province}
                            </Typography>
                        </InfoItem>

                        <InfoItem icon={<LocationOn />} label="Address">
                            <Typography>{donor.address || 'Address not provided'}</Typography>
                        </InfoItem>
                    </Grid>
                </Grid>

                {/* Donation History */}
                <Divider sx={{ my: 3 }} />

            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#c2185b', color: 'white' }}>
                    {isNewDonor ? 'Complete Donor Registration' : 'Edit Donor Profile'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={editData.name || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={editData.phone || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Blood Group"
                                name="blood_group"
                                value={editData.blood_group || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            >
                                {bloodGroups.map((group) => (
                                    <MenuItem key={group} value={group}>{group}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={editData.age || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Gender"
                                name="gender"
                                value={editData.gender || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            >
                                {genders.map((gender) => (
                                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Province"
                                name="province"
                                value={editData.province || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province} value={province}>{province}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={editData.city || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required={isNewDonor}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                rows={2}
                                value={editData.address || ''}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ bgcolor: '#c2185b' }}
                    >
                        {isNewDonor ? 'Register as Donor' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Helper Components
const InfoItem = ({ icon, label, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color: '#c2185b', mr: 2, minWidth: 30, textAlign: 'center' }}>
            {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">
                {children}
            </Typography>
        </Box>
    </Box>
);

const StatCard = ({ label, value, color }) => (
    <Card sx={{ textAlign: 'center', p: 2, bgcolor: `${color}10`, border: `1px solid ${color}30` }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color }}>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Card>
);

export default DonorComponent; 