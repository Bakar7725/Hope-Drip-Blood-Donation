import { useState, useEffect } from "react";
import {
    User,
    Phone,
    Calendar,
    FileText,
    AlertCircle,
    HeartPulse,
    ShieldCheck,
    Home,
    Droplet,
    Map,
    Building,
    Contact
} from "lucide-react";
import axios from "axios";

export default function DonorRegistrationForm({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        blood_group: "",
        age: "",
        gender: "",
        province: "",
        city: "",
        address: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [fetchingProvinces, setFetchingProvinces] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genders = ['Male', 'Female', 'Other'];

    // Get user ID from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id);
                console.log("👤 User ID loaded:", user.id);

                // Pre-fill name and phone if available
                setFormData(prev => ({
                    ...prev,
                    name: user.name || "",
                    phone: user.phone || ""
                }));
            } catch (err) {
                console.error("Error parsing user data:", err);
                setError("❌ Error loading user data. Please sign in again.");
            }
        } else {
            console.log("⚠️ No user data found in localStorage");
            setError("❌ Please sign in first to register as a donor.");
        }
    }, []);

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
        setFetchingProvinces(true);
        setError("");
        try {
            const response = await axios.get("http://localhost:8789/provinces", {
                timeout: 10000
            });

            if (Array.isArray(response.data)) {
                setProvinces(response.data);
                if (response.data.length === 0) {
                    setError("⚠️ No provinces found in database");
                }
            } else {
                console.error("❌ Provinces data is not an array:", response.data);
                setError("❌ Invalid data format received from server");
            }
        } catch (err) {
            console.error("❌ Error fetching provinces:", err);

            // Fallback provinces
            setProvinces([
                "Sindh",
                "Punjab",
                "Khyber Pakhtunkhwa",
                "Balochistan",
                "Islamabad Capital Territory",
                "Gilgit-Baltistan",
                "AJK"
            ]);
            setError("⚠️ Using fallback provinces. Server connection failed.");
        } finally {
            setFetchingProvinces(false);
        }
    };

    const fetchCities = async (province) => {
        if (!province) return;

        setLoadingCities(true);
        try {
            const response = await axios.get(`http://localhost:8789/cities/${province}`, {
                timeout: 10000
            });

            if (Array.isArray(response.data)) {
                setCities(response.data);
                if (response.data.length === 0) {
                    console.log(`⚠️ No cities found for province: ${province}`);
                }
            } else {
                console.error(`❌ Cities data for ${province} is not an array:`, response.data);
            }
        } catch (err) {
            console.error(`❌ Error fetching cities for ${province}:`, err);

            // Fallback cities
            const fallbackCities = getFallbackCities(province);
            setCities(fallbackCities);

            if (fallbackCities.length === 0) {
                setError(`⚠️ No cities found for ${province}. Please select another province.`);
            }
        } finally {
            setLoadingCities(false);
        }
    };

    const getFallbackCities = (province) => {
        const cityMap = {
            "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
            "Punjab": ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Sialkot", "Gujranwala", "Bahawalpur"],
            "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Mingora"],
            "Balochistan": ["Quetta"],
            "Islamabad Capital Territory": ["Islamabad"],
            "Gilgit-Baltistan": ["Gilgit"],
            "AJK": ["Muzaffarabad"]
        };

        return cityMap[province] || [];
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

        setError("");
        setSuccess("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.blood_group) newErrors.blood_group = 'Blood type is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.province) newErrors.province = 'Province is required';
        if (!formData.city) newErrors.city = 'City is required';

        // Age validation
        const ageNum = parseInt(formData.age);
        if (ageNum < 18 || ageNum > 65) {
            newErrors.age = 'Age must be between 18 and 65 years to donate blood.';
        }

        // Phone validation
        if (formData.phone && !/^03\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 11 digits starting with 03';
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

        if (!userId) {
            setError("❌ User not logged in. Please sign in again.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log("📤 Submitting donor registration for user ID:", userId);
            console.log("📋 Form data:", formData);

            const response = await axios.post(
                "http://localhost:8789/register-donor",
                {
                    userId: userId,
                    fullName: formData.name,
                    phone: formData.phone,
                    bloodGroup: formData.blood_group,
                    age: formData.age,
                    gender: formData.gender,
                    province: formData.province,
                    city: formData.city,
                    address: formData.address
                },
                {
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("✅ Backend response:", response.data);

            if (response.data.success) {
                setSuccess("✅ Successfully registered as a blood donor!");

                // Clear any previous errors
                setError("");

                // ✅ Update user data in localStorage with donor verification status
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    const updatedUser = {
                        ...user,
                        ...response.data.donor,
                        verification: 1, // Ensure verification is set to 1
                        donor: 1, // Ensure donor flag is set to 1
                        status: 'free' // Default status for donor
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    console.log("💾 Updated donor in localStorage:", updatedUser);

                    // ✅ Call onSuccess callback if provided
                    if (onSuccess && typeof onSuccess === 'function') {
                        console.log("📞 Calling onSuccess callback");
                        onSuccess(updatedUser); // Pass updated user data back
                    }
                }

                // Close modal after 3 seconds
                setTimeout(() => {
                    console.log("🔄 Closing modal after successful registration");
                    onClose();
                }, 3000);
            } else {
                // If success is false, show the backend error message
                setError("❌ " + (response.data.message || "Failed to register as donor"));
                setSuccess(""); // Clear success message
            }
        } catch (err) {
            console.error("❌ Submit error details:", err);

            // Clear success message on error
            setSuccess("");

            if (err.response) {
                // Server responded with error status
                console.error("📊 Server response:", err.response.data);
                console.error("📊 Server status:", err.response.status);

                const errorMessage = err.response.data?.message ||
                    err.response.data?.error ||
                    "Registration failed";
                setError("❌ " + errorMessage);
            } else if (err.request) {
                // No response received
                console.error("📡 No response from server");
                setError("❌ Cannot connect to server. Please check your connection.");
            } else if (err.code === 'ECONNABORTED') {
                // Request timeout
                setError("❌ Request timeout. Please try again.");
            } else {
                // Other errors
                setError("❌ An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {/* Header with Back Button */}
            <div className="bg-gradient-to-r from-red-900/80 to-rose-900/80 border-b border-red-500/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onClose}
                                className="flex items-center text-red-300 hover:text-white transition-colors group"
                            >
                                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Back to Home</span>
                            </button>
                        </div>

                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Donor Registration
                            </h1>
                            <p className="text-red-200 text-sm mt-1">
                                Join our life-saving community as a blood donor
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-red-500/20 p-2 rounded-lg">
                                <User className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm">Logged in</p>
                                <p className="text-white font-medium text-sm truncate max-w-[150px]">
                                    {userId ? "User #" + userId : "Not logged in"}
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
                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <span className="text-white font-medium">Personal Info</span>
                                    </div>
                                    <div className="h-1 flex-1 mx-4 bg-gray-700"></div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                            <span className="text-gray-400 font-bold">2</span>
                                        </div>
                                        <span className="text-gray-400 font-medium">Location</span>
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

                            {/* Success and Error Messages */}
                            {success && (
                                <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-6 h-6 text-green-400" />
                                        <p className="text-green-300">{success}</p>
                                    </div>
                                </div>
                            )}

                            {error && !success && (
                                <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-6 h-6 text-red-400" />
                                        <p className="text-red-300">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Form Card */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-red-500/20 p-2 rounded-lg">
                                        <Droplet className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Donor Registration Form</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="w-5 h-5 text-red-400" />
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
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                                                    placeholder="Enter your full name"
                                                    disabled={loading}
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
                                                    Phone Number *
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className={`w-full pl-12 pr-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.phone ? 'border-red-500' : 'border-gray-700'}`}
                                                        placeholder="03XXXXXXXXX"
                                                        maxLength="11"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Age *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.age ? 'border-red-500' : 'border-gray-700'}`}
                                                    placeholder="18-65"
                                                    min="18"
                                                    max="65"
                                                    disabled={loading}
                                                />
                                                {errors.age && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.age}</p>
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
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.gender ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={loading}
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
                                        </div>
                                    </section>

                                    {/* Location Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Map className="w-5 h-5 text-red-400" />
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
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.province ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={loading || fetchingProvinces || provinces.length === 0}
                                                >
                                                    <option value="" className="text-gray-500">
                                                        {fetchingProvinces ? 'Loading provinces...' : 'Select Province'}
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
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.city ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={loading || !formData.province || loadingCities}
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
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white resize-none"
                                                placeholder="Enter your complete address..."
                                                disabled={loading}
                                            />
                                        </div>
                                    </section>

                                    {/* Blood Information */}
                                    <section className="bg-gray-900/50 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Droplet className="w-5 h-5 text-red-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Blood Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Blood Type *
                                                </label>
                                                <select
                                                    name="blood_group"
                                                    value={formData.blood_group}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all text-white ${errors.blood_group ? 'border-red-500' : 'border-gray-700'}`}
                                                    disabled={loading}
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

                                            <div className="md:col-span-2">
                                                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-white font-medium mb-2">Donor Requirements</h4>
                                                            <ul className="text-gray-300 text-sm space-y-1">
                                                                <li>• Must be between 18-65 years old</li>
                                                                <li>• Minimum weight: 50 kg</li>
                                                                <li>• Should not have any chronic diseases</li>
                                                                <li>• Last donation should be at least 3 months ago</li>
                                                                <li>• Should not be on any medication that affects blood</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Form Actions */}
                                    <div className="pt-8 border-t border-gray-700">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="text-gray-400 text-sm">
                                                <p className="flex items-center mb-2">
                                                    <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
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
                                                    disabled={loading}
                                                    className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:border-gray-500 transition-all font-medium disabled:opacity-50 min-w-[120px]"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading || fetchingProvinces}
                                                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 min-w-[180px] flex items-center justify-center"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            Registering...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Droplet className="w-5 h-5 mr-2" />
                                                            Register as Donor
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
                                <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-red-500/20 p-2 rounded-lg">
                                            <Contact className="w-6 h-6 text-red-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Your Account</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-400 text-sm">User ID</p>
                                            <p className="text-white font-medium">{userId || 'Not logged in'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Status</p>
                                            <p className="text-white font-medium capitalize">Registering as Donor</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Verification</p>
                                            <p className="text-yellow-400 font-medium">Pending</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-orange-500/20 p-2 rounded-lg">
                                            <HeartPulse className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Donor Benefits</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="bg-orange-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Receive donation requests from patients
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-orange-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Free health checkups with each donation
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-orange-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Donation certificate and rewards
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-orange-500/10 p-1 rounded mt-0.5">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-300 text-sm">
                                                Priority in emergency for you and family
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-purple-500/20 p-2 rounded-lg">
                                            <FileText className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Important Notes</h3>
                                    </div>
                                    <ul className="space-y-3 text-gray-300 text-sm">
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                            <span>Once registered, your status will be set to "Free" (available)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                            <span>You can toggle your availability from your profile</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                            <span>Your contact will only be shared with verified patients</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-red-400" />
                                        <p className="text-gray-400 text-sm">
                                            All data is encrypted and secure
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Need help?{' '}
                                        <button className="text-red-400 hover:text-red-300 transition-colors">
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
}