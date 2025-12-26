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
    LocalHospital,
    MedicalServices,
    Emergency,
    Notes,
    CalendarToday,
    CheckCircle,
    History,
    Close as CloseIcon,
    AccountBalanceWallet // Use this instead of Insurance
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const PatientComponent = ({ userId }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const provinces = [
        'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
        'Gilgit-Baltistan', 'Azad Jammu & Kashmir', 'Islamabad'
    ];

    useEffect(() => {
        fetchPatientData();
    }, [userId]);

    const fetchPatientData = async () => {
        try {
            const response = await axios.get(`http://localhost:8789/patient-profile/${userId}`);
            if (response.data.success) {
                setPatient(response.data.user);
                setEditData(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Failed to load patient information');
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

    const calculateAge = (dob) => {
        if (!dob) return 'Unknown';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8789/register-patient', {
                id: userId,
                name: editData.name,
                blood_group: editData.blood_group,
                gender: editData.gender,
                date_of_birth: editData.date_of_birth,
                medical_condition: editData.medical_condition,
                emergency_contact: editData.emergency_contact,
                hospital_name: editData.hospital_name,
                doctor_name: editData.doctor_name,
                insurance_info: editData.insurance_info,
                additional_notes: editData.additional_notes,
                province: editData.province,
                city: editData.city,
                address: editData.address
            });

            if (response.data.success) {
                setPatient(response.data.patient);
                toast.success('Patient profile updated successfully!');
                handleEditClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'inactive': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', p: 3 }}>
                <LinearProgress />
            </Box>
        );
    }

    if (!patient || patient.patient !== 1) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                This user is not registered as a patient.
            </Alert>
        );
    }

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{ width: 70, height: 70, bgcolor: '#1976d2' }}
                            alt={patient.name}
                            src={`https://ui-avatars.com/api/?name=${patient.name}&background=1976d2&color=fff`}
                        >
                            {patient.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {patient.name}
                                {patient.verification === 1 && (
                                    <Tooltip title="Verified Patient">
                                        <CheckCircle sx={{ color: 'green', ml: 1, fontSize: 20 }} />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                @{patient.username}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                    label={`Patient ID: PAT-${patient.id.toString().padStart(6, '0')}`}
                                    size="small"
                                    variant="outlined"
                                />
                                <Chip
                                    label={patient.patient_status || 'active'}
                                    color={getStatusColor(patient.patient_status)}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Box>


                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Information Grid */}
                <Grid container spacing={3}>
                    {/* Medical Information Column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                            <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Medical Information
                        </Typography>

                        <InfoItem icon={<Bloodtype />} label="Blood Group Required">
                            <Chip
                                label={patient.blood_group || 'Not Specified'}
                                color="error"
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </InfoItem>

                        <InfoItem icon={<Cake />} label="Age">
                            <Typography>
                                {calculateAge(patient.date_of_birth)} years
                                {patient.date_of_birth && (
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        (DOB: {new Date(patient.date_of_birth).toLocaleDateString()})
                                    </Typography>
                                )}
                            </Typography>
                        </InfoItem>

                        <InfoItem icon={<Transgender />} label="Gender">
                            <Typography>{patient.gender || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<LocalHospital />} label="Medical Condition">
                            <Typography>{patient.medical_condition || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Emergency />} label="Emergency Contact">
                            <Typography>{patient.emergency_contact || 'Not Provided'}</Typography>
                        </InfoItem>
                    </Grid>

                    {/* Hospital & Contact Column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                            <LocalHospital sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Hospital & Contact
                        </Typography>

                        <InfoItem icon={<LocalHospital />} label="Hospital">
                            <Typography>{patient.hospital_name || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Person />} label="Doctor">
                            <Typography>{patient.doctor_name || 'Not Specified'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<AccountBalanceWallet />} label="Insurance">
                            <Typography>{patient.insurance_info || 'Not Provided'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Email />} label="Email">
                            <Typography>{patient.email}</Typography>
                        </InfoItem>

                        <InfoItem icon={<Phone />} label="Phone">
                            <Typography>{patient.phone || 'Not Provided'}</Typography>
                        </InfoItem>

                        <InfoItem icon={<LocationOn />} label="Location">
                            <Typography>
                                {patient.city}, {patient.province}
                            </Typography>
                        </InfoItem>
                    </Grid>
                </Grid>

                {/* Additional Notes */}

            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                    Edit Patient Medical Profile
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
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Blood Group Required"
                                name="blood_group"
                                value={editData.blood_group || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            >
                                {bloodGroups.map((group) => (
                                    <MenuItem key={group} value={group}>{group}</MenuItem>
                                ))}
                            </TextField>
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
                                required
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                value={editData.date_of_birth || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Medical Condition"
                                name="medical_condition"
                                multiline
                                rows={3}
                                value={editData.medical_condition || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                name="emergency_contact"
                                value={editData.emergency_contact || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="Format: 03XXXXXXXXX"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Hospital Name"
                                name="hospital_name"
                                value={editData.hospital_name || ''}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Doctor Name"
                                name="doctor_name"
                                value={editData.doctor_name || ''}
                                onChange={handleInputChange}
                                margin="normal"
                            />
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={editData.address || ''}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Insurance Information"
                                name="insurance_info"
                                multiline
                                rows={2}
                                value={editData.insurance_info || ''}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Additional Notes"
                                name="additional_notes"
                                multiline
                                rows={2}
                                value={editData.additional_notes || ''}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2' }}>
                        Save Medical Profile
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Helper Components
const InfoItem = ({ icon, label, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ color: '#1976d2', mr: 2, minWidth: 30, mt: 0.5 }}>
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

export default PatientComponent;