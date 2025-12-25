import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Calendar,
    FileText,
    AlertCircle,
    HeartPulse,
    ShieldCheck,
    Stethoscope,
    Home,
    Building,
    Contact,
    MapPin,
    Navigation,
    Map
} from 'lucide-react';

const PatientRegistration = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        blood_group: '',
        gender: '',
        medical_condition: '',
        emergency_contact: '',
        hospital_name: '',
        doctor_name: '',
        insurance_info: '',
        additional_notes: '',
        province: '',
        city: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genders = ['Male', 'Female', 'Other'];

    // Fetch provinces on component mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (formData.province) {
            fetchCities(formData.province);
        } else {
            setCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.province]);

    const fetchProvinces = async () => {
        try {
            const response = await fetch('http://localhost:8789/provinces');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchCities = async (province) => {
        if (!province) return;

        setLoadingCities(true);
        try {
            const response = await fetch(`http://localhost:8789/cities/${province}`);
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.blood_group) newErrors.blood_group = 'Blood type is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.medical_condition.trim()) newErrors.medical_condition = 'Medical condition is required';
        if (!formData.emergency_contact.trim()) newErrors.emergency_contact = 'Emergency contact is required';
        if (!formData.hospital_name.trim()) newErrors.hospital_name = 'Hospital name is required';
        if (!formData.province) newErrors.province = 'Province is required';
        if (!formData.city) newErrors.city = 'City is required';

        // Phone validation
        if (!/^03\d{9}$/.test(formData.emergency_contact)) {
            newErrors.emergency_contact = 'Phone must be 11 digits starting with 03';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Get user ID from localStorage if not available in props
            let userId = user?.id;

            if (!userId) {
                // Try to get from localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    userId = parsedUser.id;
                    console.log("📋 User ID retrieved from localStorage:", userId);
                }
            }

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            // Calculate age from date of birth
            const calculateAge = (dateOfBirth) => {
                const today = new Date();
                const birthDate = new Date(dateOfBirth);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };

            const patientData = {
                id: userId, // Use the retrieved user ID
                name: formData.name,
                blood_group: formData.blood_group,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                medical_condition: formData.medical_condition,
                emergency_contact: formData.emergency_contact,
                hospital_name: formData.hospital_name,
                doctor_name: formData.doctor_name,
                insurance_info: formData.insurance_info,
                additional_notes: formData.additional_notes,
                province: formData.province,
                city: formData.city,
                address: formData.address,
                // Patient status will be set to 'active' by backend
            };

            console.log('Sending patient registration data:', patientData);

            // API call to update user as patient
            const response = await fetch('http://localhost:8789/register-patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            console.log('✅ Registration successful:', data);

            // Update localStorage with patient status
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                const updatedUser = {
                    ...parsedUser,
                    patient: 1,
                    patient_status: 'active',
                    status: 'active',
                    name: formData.name,
                    blood_group: formData.blood_group,
                    gender: formData.gender,
                    province: formData.province,
                    city: formData.city,
                    address: formData.address,
                    verification: 1
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log("✅ Updated patient status in localStorage");
            }

            setIsSubmitting(false);
            onSuccess(data.patient || data); // Pass the patient data to parent

        } catch (error) {
            console.error('❌ Registration error:', error);
            alert(`Registration failed: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {/* Header with Back Button */}
            <div className="bg-gradient-to-r from-teal-900/80 to-emerald-900/80 border-b border-teal-500/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onClose}
                                className="flex items-center text-teal-300 hover:text-white transition-colors group"
                            >
                                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Back to Home</span>
                            </button>
                        </div>

                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Patient Registration
                            </h1>
                            <p className="text-teal-200 text-sm mt-1">
                                Register as a patient to access emergency blood services
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-teal-500/20 p-2 rounded-lg">
                                <User className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm">Logged in</p>
                                <p className="text-white font-medium text-sm truncate max-w-[150px]">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            {/* Progress Indicator */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <span className="text-white font-medium">Personal Info</span>
                                    </div>
                                    <div className="h-1 flex-1 mx-4 bg-gray-700"></div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                            <span className="text-gray-400 font-bold">2</span>
                                        </div>
                                        <span className="text-gray-400 font-medium">Medical Info</span>
                                    </div>
                                    <div className="h-1 flex-1 mx-4 bg-gray-700"></div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                            <span className="text-gray-400 font-bold">3</span>
                                        </div>
                                        <span className="text-gray-400 font-medium">Review</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-teal-500/20 p-2 rounded-lg">
                                        <ShieldCheck className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Patient Registration Form</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="w-5 h-5 text-teal-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Personal Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                                                    placeholder="Enter your full name"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Date of Birth *
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                    <input
                                                        type="date"
                                                        name="date_of_birth"
                                                        value={formData.date_of_birth}
                                                        onChange={handleChange}
                                                        className={`w-full pl-12 pr-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.date_of_birth ? 'border-red-500' : 'border-gray-700'}`}
                                                    />
                                                </div>
                                                {errors.date_of_birth && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.date_of_birth}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Gender *
                                                </label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.gender ? 'border-red-500' : 'border-gray-700'}`}
                                                >
                                                    <option value="" className="text-gray-500">Select Gender</option>
                                                    {genders.map(gender => (
                                                        <option key={gender} value={gender} className="text-white bg-gray-800">
                                                            {gender}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.gender && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.gender}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Blood Type *
                                                </label>
                                                <select
                                                    name="blood_group"
                                                    value={formData.blood_group}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.blood_group ? 'border-red-500' : 'border-gray-700'}`}
                                                >
                                                    <option value="" className="text-gray-500">Select Blood Type</option>
                                                    {bloodTypes.map(type => (
                                                        <option key={type} value={type} className="text-white bg-gray-800">
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.blood_group && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.blood_group}</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Location Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Map className="w-5 h-5 text-teal-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Location Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Province *
                                                </label>
                                                <select
                                                    name="province"
                                                    value={formData.province}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.province ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={provinces.length === 0}
                                                >
                                                    <option value="" className="text-gray-500">
                                                        {provinces.length === 0 ? 'Loading provinces...' : 'Select Province'}
                                                    </option>
                                                    {provinces.map((province, index) => (
                                                        <option key={index} value={province} className="text-white bg-gray-800">
                                                            {province}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.province && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.province}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    City *
                                                </label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.city ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={!formData.province || loadingCities}
                                                >
                                                    <option value="" className="text-gray-500">
                                                        {loadingCities ? 'Loading cities...' :
                                                            !formData.province ? 'Select province first' :
                                                                'Select City'}
                                                    </option>
                                                    {cities.map((city, index) => (
                                                        <option key={index} value={city} className="text-white bg-gray-800">
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.city && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.city}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Address
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white resize-none"
                                                placeholder="Enter your complete address..."
                                            />
                                        </div>
                                    </section>

                                    {/* Medical Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <HeartPulse className="w-5 h-5 text-teal-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Medical Information
                                            </h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Emergency Contact *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    name="emergency_contact"
                                                    value={formData.emergency_contact}
                                                    onChange={handleChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.emergency_contact ? 'border-red-500' : 'border-gray-700'}`}
                                                    placeholder="03XXXXXXXXX"
                                                    maxLength="11"
                                                />
                                            </div>
                                            {errors.emergency_contact && (
                                                <p className="text-red-400 text-sm mt-2">{errors.emergency_contact}</p>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Medical Condition *
                                            </label>
                                            <input
                                                type="text"
                                                name="medical_condition"
                                                value={formData.medical_condition}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.medical_condition ? 'border-red-500' : 'border-gray-700'}`}
                                                placeholder="e.g., Thalassemia, Cancer, Surgery, etc."
                                            />
                                            {errors.medical_condition && (
                                                <p className="text-red-400 text-sm mt-2">{errors.medical_condition}</p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Hospital Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Building className="w-5 h-5 text-teal-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Hospital Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Hospital Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="hospital_name"
                                                    value={formData.hospital_name}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white ${errors.hospital_name ? 'border-red-500' : 'border-gray-700'}`}
                                                    placeholder="Name of treating hospital"
                                                />
                                                {errors.hospital_name && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.hospital_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Doctor's Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="doctor_name"
                                                    value={formData.doctor_name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white"
                                                    placeholder="Treating doctor's name"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Insurance Information
                                            </label>
                                            <textarea
                                                name="insurance_info"
                                                value={formData.insurance_info}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white resize-none"
                                                placeholder="Insurance details, if any..."
                                            />
                                        </div>
                                    </section>

                                    {/* Additional Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <FileText className="w-5 h-5 text-teal-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Additional Information
                                            </h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Additional Notes
                                            </label>
                                            <textarea
                                                name="additional_notes"
                                                value={formData.additional_notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all text-white resize-none"
                                                placeholder="Any additional information about your condition, requirements, or special needs..."
                                            />
                                        </div>
                                    </section>

                                    {/* Form Actions */}
                                    <div className="pt-8 border-t border-gray-700">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="text-gray-400 text-sm">
                                                <p className="flex items-center mb-2">
                                                    <AlertCircle className="w-4 h-4 mr-2 text-teal-400" />
                                                    <span>* Required fields</span>
                                                </p>
                                                <p className="text-gray-500">
                                                    Your information will be kept confidential and secure.
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    disabled={isSubmitting}
                                                    className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:border-gray-500 transition-all font-medium disabled:opacity-50 min-w-[120px]"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 min-w-[180px] flex items-center justify-center"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            Registering...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="w-5 h-5 mr-2" />
                                                            Complete Registration
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 backdrop-blur-sm border border-teal-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-teal-500/20 p-2 rounded-lg">
                                            <Contact className="w-6 h-6 text-teal-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Your Account</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-400 text-sm">Email</p>
                                            <p className="text-white font-medium truncate">{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Phone</p>
                                            <p className="text-white font-medium">{user?.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Current Status</p>
                                            <p className="text-white font-medium capitalize">{user?.status || 'Not registered'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <AlertCircle className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Patient Benefits</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="bg-blue-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Submit emergency blood requests
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-blue-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Real-time tracking of requests
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-blue-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Priority for emergency cases
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-blue-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                24/7 support for critical cases
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-teal-400" />
                                        <p className="text-gray-400 text-sm">
                                            All data is encrypted and secure
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Need help?{' '}
                                        <button className="text-teal-400 hover:text-teal-300 transition-colors">
                                            Contact Support
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;