import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiRefreshCw } from "react-icons/fi";
import axios from "axios";

export default function DonorRegistrationForm({ onClose }) {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        bloodGroup: "",
        age: "",
        gender: "",
        province: "",
        city: "",
        address: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCities, setFetchingCities] = useState(false);
    const [fetchingProvinces, setFetchingProvinces] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userId, setUserId] = useState(null);

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
                    fullName: user.name || "",
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

        setFetchingCities(true);
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
            setFetchingCities(false);
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
        setFormData({ ...formData, [name]: value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError("❌ User not logged in. Please sign in again.");
            return;
        }

        // Validation
        const requiredFields = ['fullName', 'phone', 'bloodGroup', 'age', 'gender', 'province', 'city'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setError(`❌ Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Age validation
        const ageNum = parseInt(formData.age);
        if (ageNum < 18 || ageNum > 65) {
            setError("❌ Age must be between 18 and 65 years to donate blood.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:8789/register-donor", {
                userId: userId,
                fullName: formData.fullName,
                phone: formData.phone,
                bloodGroup: formData.bloodGroup,
                age: formData.age,
                gender: formData.gender,
                province: formData.province,
                city: formData.city,
                address: formData.address
            }, {
                timeout: 15000
            });

            if (response.data.success) {
                setSuccess("✅ Successfully registered as a blood donor!");

                // ✅ Update user data in localStorage with donor verification status
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    const updatedUser = {
                        ...user,
                        ...response.data.donor,
                        verification: 1, // Ensure verification is set to 1
                        donor: 1 // Ensure donor flag is set to 1
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    console.log("💾 Updated donor in localStorage:", updatedUser);

                    // ✅ IMPORTANT: Call onSuccess callback if provided
                    if (onSuccess && typeof onSuccess === 'function') {
                        onSuccess(updatedUser); // Pass updated user data back
                    }
                }

                // Close modal after 3 seconds
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setError("❌ " + (response.data.message || "Failed to register as donor"));
            }
        } catch (err) {
            console.error("❌ Submit error:", err);
            if (err.response?.data?.message) {
                setError("❌ " + err.response.data.message);
            } else if (err.code === 'ECONNREFUSED') {
                setError("❌ Cannot connect to server. Please try again later.");
            } else {
                setError("❌ Failed to register as donor. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <form
                onSubmit={handleSubmit}
                className="w-[550px] bg-[#0e1322] text-white p-10 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 rounded p-1 transition"
                    disabled={loading}
                >
                    <RxCross2 size={20} />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6 text-red-400">
                    🩸 Register as Blood Donor
                </h2>

                <p className="text-center text-gray-300 mb-6">
                    Join our life-saving community. Your donation can save lives!
                </p>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-3 bg-green-700/30 text-green-300 rounded-md text-center">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-700/30 text-red-300 rounded-md text-center">
                        {error}
                        {error.includes("server") && (
                            <button
                                type="button"
                                onClick={fetchProvinces}
                                className="ml-2 inline-flex items-center text-sm underline"
                            >
                                <FiRefreshCw size={14} className="mr-1" />
                                Retry
                            </button>
                        )}
                    </div>
                )}

                {/* Full Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 placeholder-gray-400"
                        disabled={loading}
                    />
                </div>

                {/* Phone & Age */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 placeholder-gray-400"
                        disabled={loading}
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age (18-65) *"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="18"
                        max="65"
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 placeholder-gray-400"
                        disabled={loading}
                    />
                </div>

                {/* Blood Group & Gender */}
                <div className="flex gap-4 mb-4">
                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 text-gray-400"
                        disabled={loading}
                    >
                        <option value="">Blood Group *</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 text-gray-400"
                        disabled={loading}
                    >
                        <option value="">Gender *</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Province & City */}
                <div className="flex gap-4 mb-4">
                    <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 text-gray-400"
                        disabled={loading || fetchingProvinces}
                    >
                        <option value="">
                            {fetchingProvinces ? "Loading provinces..." : "Province *"}
                        </option>
                        {provinces.map((province, index) => (
                            <option key={index} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>

                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 text-gray-400"
                        disabled={loading || !formData.province || fetchingCities}
                    >
                        <option value="">
                            {fetchingCities
                                ? "Loading cities..."
                                : formData.province
                                    ? cities.length > 0 ? "City *" : "No cities available"
                                    : "Select province first"
                            }
                        </option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Address */}
                <textarea
                    name="address"
                    rows="3"
                    placeholder="Full Address (Optional)"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gray-400 focus:border-red-500 outline-none py-2 mb-6 placeholder-gray-400 resize-none"
                    disabled={loading}
                />

                {/* Terms & Conditions */}
                <div className="mb-6 text-sm text-gray-400">
                    <p className="mb-2">By registering as a donor, you agree to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Be contacted for blood donation requests</li>
                        <li>Provide accurate health information</li>
                        <li>Donate voluntarily without any compensation</li>
                        <li>Update your availability status regularly</li>
                    </ul>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || fetchingProvinces}
                    className="w-full py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
                >
                    {loading ? (
                        <>
                            <FiRefreshCw className="animate-spin mr-2" size={18} />
                            Registering...
                        </>
                    ) : userId ? "Register as Blood Donor" : "Please Sign In"}
                </button>

                {/* Debug Info */}
                <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
                    {userId && <p>User ID: {userId}</p>}
                    <p>Status will be automatically set to: <span className="text-green-400">Free</span></p>
                    <p>Donor flag will be set to: <span className="text-green-400">1 (Active)</span></p>
                </div>
            </form>
        </div>
    );
}