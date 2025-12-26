import React from 'react';
import bg from "./images/content1.2.jpg";
import { Droplet, HeartHandshake, Zap, CalendarDays, BarChart4, Hospital, ShieldUser, AlertCircle } from 'lucide-react';
import axios from 'axios';

function Content1_2({
    A,
    B,
    C,
    user,
    setUser,
    showPatientRegistration,
    onPatientRegistrationClose,
    onPatientRegistrationShow
}) {
    const [isVerifiedDonor, setIsVerifiedDonor] = React.useState(false);
    const [isVerifiedPatient, setIsVerifiedPatient] = React.useState(false);
    const [loading, setLoading] = React.useState(false); // ✅ یہ API checking کے لیے ہے
    const [deleting, setDeleting] = React.useState(false);
    const [showDonorConflictPopup, setShowDonorConflictPopup] = React.useState(false);
    const [showPatientConflictPopup, setShowPatientConflictPopup] = React.useState(false);
    const [hasCheckedPatientStatus, setHasCheckedPatientStatus] = React.useState(false);

    // Function to check patient status from API - ONCE only
    const checkPatientStatus = React.useCallback(async () => {
        if (user && user.id && !hasCheckedPatientStatus && !isVerifiedPatient) {
            try {
                setLoading(true);
                console.log("🔄 Checking patient status from API...");

                const response = await fetch(`http://localhost:8789/check-patient/${user.id}`);
                const data = await response.json();

                console.log("🔍 Patient API Response:", data);

                if (data.success) {
                    // Use API as the single source of truth
                    const isPatientFromAPI = data.patient === 1;

                    // Update UI state with API data
                    setIsVerifiedPatient(isPatientFromAPI);
                    setHasCheckedPatientStatus(true);

                    // ALWAYS sync localStorage with API data
                    const updatedUser = {
                        ...user,
                        patient: data.patient,
                        patient_status: data.patient === 1 ? 'active' : null
                    };

                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    if (setUser && typeof setUser === 'function') {
                        setUser(updatedUser);
                    }

                    window.dispatchEvent(new CustomEvent('userUpdated', {
                        detail: updatedUser
                    }));
                } else {
                    setHasCheckedPatientStatus(true);
                }
            } catch (error) {
                console.error("❌ Error checking patient status:", error);
                setHasCheckedPatientStatus(true);
            } finally {
                setLoading(false); // ✅ API call مکمل ہونے پر loading false کریں
            }
        }
    }, [user, setUser, hasCheckedPatientStatus, isVerifiedPatient]);

    React.useEffect(() => {
        console.log("🔍 Current user object in Content1_2:", user);

        if (user) {
            // Check donor status - verified if verification=1 AND donor=1
            const donorVerified = user.verification === 1 && user.donor === 1;
            setIsVerifiedDonor(donorVerified);

            // Check if we need to check patient status
            if (user.patient === 1) {
                // If already patient in localStorage, use that
                setIsVerifiedPatient(true);
                setHasCheckedPatientStatus(true);
                setLoading(false); // ✅ اگر پہلے سے patient ہے تو loading false کریں
            } else if (!hasCheckedPatientStatus) {
                // Only check API if we haven't checked yet
                checkPatientStatus();
            } else {
                setLoading(false); // ✅ اگر پہلے چیک کر چکے ہیں تو loading false کریں
            }
        } else {
            setIsVerifiedDonor(false);
            setIsVerifiedPatient(false);
            setHasCheckedPatientStatus(false);
            setLoading(false); // ✅ اگر user نہیں ہے تو loading false کریں
        }
    }, [user]);

    // Listen for user updates
    React.useEffect(() => {
        const handleUserUpdated = (event) => {
            console.log('🔄 User updated event received in Content1_2', event.detail);

            if (event.detail) {
                // Update donor status
                const donorVerified = event.detail.verification === 1 && event.detail.donor === 1;
                setIsVerifiedDonor(donorVerified);

                // Update patient status
                setIsVerifiedPatient(event.detail.patient === 1);

                // Mark as checked since we got updated data
                if (event.detail.patient !== undefined) {
                    setHasCheckedPatientStatus(true);
                }
            }
        };

        const handleUserDataDeleted = (event) => {
            console.log('🎯 User data deleted event received in Content1_2:', event.detail);

            if (event.detail) {
                // Update donor status
                const donorVerified = event.detail.verification === 1 && event.detail.donor === 1;
                setIsVerifiedDonor(donorVerified);

                // Update patient status
                setIsVerifiedPatient(event.detail.patient === 1);
                setHasCheckedPatientStatus(true);
            }
        };

        window.addEventListener('userUpdated', handleUserUpdated);
        window.addEventListener('userDataDeleted', handleUserDataDeleted);

        return () => {
            window.removeEventListener('userUpdated', handleUserUpdated);
            window.removeEventListener('userDataDeleted', handleUserDataDeleted);
        };
    }, []);

    // ✅ Function to delete donor registration using API
    const handleDeleteDonorRegistration = async () => {
        try {
            setDeleting(true);

            if (!user || !user.id) {
                alert('User not found. Please login again.');
                setShowDonorConflictPopup(false);
                return;
            }

            const response = await axios.put('http://localhost:8789/delete-user-role-data', {
                userId: user.id
            });

            if (response.data.success) {
                alert('✅ Donor registration has been removed successfully!');

                const updatedUser = {
                    ...user,
                    ...response.data.user
                };

                localStorage.setItem('user', JSON.stringify(updatedUser));

                if (setUser && typeof setUser === 'function') {
                    setUser(updatedUser);
                }

                // Update local state
                setIsVerifiedDonor(response.data.user.donor === 1 && response.data.user.verification === 1);
                setIsVerifiedPatient(response.data.user.patient === 1);
                setHasCheckedPatientStatus(true);

                window.dispatchEvent(new CustomEvent('userUpdated', {
                    detail: updatedUser
                }));

                window.dispatchEvent(new CustomEvent('userDataDeleted', {
                    detail: response.data.user
                }));

                // Close the popup
                setShowDonorConflictPopup(false);

                // Now show patient registration form
                setTimeout(() => {
                    if (typeof onPatientRegistrationShow === 'function') {
                        console.log("📞 Calling onPatientRegistrationShow after donor deletion");
                        C();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Error deleting donor data:', error);
            alert(`Failed to delete donor data: ${error.response?.data?.error || error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    // ✅ Function to delete patient registration using API
    const handleDeletePatientRegistration = async () => {
        try {
            setDeleting(true);

            if (!user || !user.id) {
                alert('User not found. Please login again.');
                setShowPatientConflictPopup(false);
                return;
            }

            const response = await axios.put('http://localhost:8789/delete-user-role-data', {
                userId: user.id
            });

            if (response.data.success) {
                alert('✅ Patient registration has been removed successfully!');

                const updatedUser = {
                    ...user,
                    ...response.data.user
                };

                localStorage.setItem('user', JSON.stringify(updatedUser));

                if (setUser && typeof setUser === 'function') {
                    setUser(updatedUser);
                }

                // Update local state
                setIsVerifiedDonor(response.data.user.donor === 1 && response.data.user.verification === 1);
                setIsVerifiedPatient(response.data.user.patient === 1);
                setHasCheckedPatientStatus(true);

                window.dispatchEvent(new CustomEvent('userUpdated', {
                    detail: updatedUser
                }));

                window.dispatchEvent(new CustomEvent('userDataDeleted', {
                    detail: response.data.user
                }));

                // Close the popup
                setShowPatientConflictPopup(false);

                // Now show donor registration form
                setTimeout(() => {
                    if (typeof B === 'function') {
                        B();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Error deleting patient data:', error);
            alert(`Failed to delete patient data: ${error.response?.data?.error || error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    const handleDonorClick = (e) => {
        e.preventDefault();

        if (isVerifiedDonor) {
            alert("✅ You are already a registered and verified donor!");
            return;
        }

        if (user) {
            // Check if user is already registered as a patient
            if (isVerifiedPatient) {
                // Show popup if user is a registered patient
                console.log("⚠️ User is a registered patient, showing conflict popup for donor");
                setShowPatientConflictPopup(true);
            } else {
                console.log("📞 Calling B() function for donor registration");
                B(); // Donor    registration form
            }
        } else {
            console.log("📞 Calling A() function for sign in");
            A(); // Sign in
        }
    };

    const handlePatientClick = (e) => {
        e.preventDefault();

        console.log("🩺 Patient button clicked!");
        console.log("isVerifiedPatient:", isVerifiedPatient);
        console.log("isVerifiedDonor:", isVerifiedDonor);
        console.log("user:", user);
        console.log("onPatientRegistrationShow type:", typeof onPatientRegistrationShow);
        console.log("loading state:", loading); // ✅ یہ دیکھیں کہ loading true ہے یا false

        if (isVerifiedPatient) {
            alert("✅ You are already a registered patient!");
            return;
        }

        if (user) {
            // Check if user is already registered as a donor
            if (isVerifiedDonor) {
                // Show popup if user is a verified donor
                console.log("⚠️ User is a verified donor, showing conflict popup");
                setShowDonorConflictPopup(true);
            } else {
                // Call parent function to show patient registration
                if (typeof onPatientRegistrationShow === 'function') {
                    console.log("📞 Calling onPatientRegistrationShow function now...");
                    onPatientRegistrationShow();
                } else {
                    console.error("❌ onPatientRegistrationShow function is not defined!");
                    alert("Patient registration function is not available. Please refresh the page or contact support.");
                }
            }
        } else {
            console.log("📞 Calling A() function for sign in (patient)");
            A(); // Sign in
        }
    };

    const handleCloseDonorConflictPopup = () => {
        setShowDonorConflictPopup(false);
    };

    const handleClosePatientConflictPopup = () => {
        setShowPatientConflictPopup(false);
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'lighten'
            }}
        >
            {/* Donor Conflict Popup - When donor tries to register as patient */}
            {showDonorConflictPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            onClick={handleCloseDonorConflictPopup}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                            disabled={deleting}
                        >
                            ×
                        </button>
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-500 mb-2">
                                Donor Registration Conflict
                            </h3>
                            <p className="text-gray-300 mb-4">
                                You are currently registered as a <span className="font-bold text-red-400">verified donor</span>.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <p className="text-gray-300 mb-3">
                                <span className="font-bold">Policy Restriction:</span>
                            </p>
                            <ul className="text-gray-400 text-sm space-y-2 mb-4">
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    One account can only have one primary role (either Donor OR Patient)
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    This ensures proper tracking and prevents role conflicts
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    If you want to register as a patient, you need to remove your donor registration first
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    You can always re-register as a donor later if needed
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeleteDonorRegistration}
                                disabled={deleting}
                                className={`${deleting ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center`}
                            >
                                {deleting ? (
                                    <>
                                        <span className="animate-spin mr-2">⟳</span>
                                        Removing...
                                    </>
                                ) : (
                                    'Remove Donor Registration'
                                )}
                            </button>
                            <button
                                onClick={handleCloseDonorConflictPopup}
                                disabled={deleting}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Note: This will delete all your donor-related data
                        </p>
                    </div>
                </div>
            )}

            {/* Patient Conflict Popup - When patient tries to register as donor */}
            {showPatientConflictPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border-2 border-teal-500 rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            onClick={handleClosePatientConflictPopup}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                            disabled={deleting}
                        >
                            ×
                        </button>
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="w-16 h-16 text-teal-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-teal-500 mb-2">
                                Patient Registration Conflict
                            </h3>
                            <p className="text-gray-300 mb-4">
                                You are currently registered as a <span className="font-bold text-teal-400">patient</span>.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <p className="text-gray-300 mb-3">
                                <span className="font-bold">Policy Restriction:</span>
                            </p>
                            <ul className="text-gray-400 text-sm space-y-2 mb-4">
                                <li className="flex items-start">
                                    <span className="text-teal-400 mr-2">•</span>
                                    One account can only have one primary role (either Donor OR Patient)
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-400 mr-2">•</span>
                                    This ensures proper tracking and prevents role conflicts
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-400 mr-2">•</span>
                                    If you want to register as a donor, you need to remove your patient registration first
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-400 mr-2">•</span>
                                    You can always re-register as a patient later if needed
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeletePatientRegistration}
                                disabled={deleting}
                                className={`${deleting ? 'bg-gray-600 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center`}
                            >
                                {deleting ? (
                                    <>
                                        <span className="animate-spin mr-2">⟳</span>
                                        Removing...
                                    </>
                                ) : (
                                    'Remove Patient Registration'
                                )}
                            </button>
                            <button
                                onClick={handleClosePatientConflictPopup}
                                disabled={deleting}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Note: This will delete all your patient-related data
                        </p>
                    </div>
                </div>
            )}

            {/* Section Heading */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                    Find Your Path to Hope
                </h2>
                <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                    Whether you are giving life or seeking it, Hope Drip is here to support you every step of the way.
                </p>
            </div>

            {/* Donor and Patient Cards */}
            <div className="flex flex-row gap-20 pl-16">
                {/* DONOR CARD */}
                <div className="bg-black max-w-96 p-8 rounded-2xl shadow-2xl border-4 border-red-500 hover:shadow-red-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Droplet className="w-10 h-10 text-red-500" />
                        <h3 className="text-3xl font-bold text-red-500">
                            {user ? "Donor Dashboard" : "Donate Blood"}
                        </h3>
                    </div>
                    <p className="text-red-500 mb-6 flex justify-center">
                        <Hospital className="w-12 h-12 text-red-500" />
                    </p>
                    <ul className="space-y-3 text-gray-700 list-none pl-0">
                        <li className="flex items-start text-red-500">
                            <Zap className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            {isVerifiedDonor ? "View your donor profile" : "Fast registration and screening process."}
                        </li>
                        <li className="flex items-start text-red-500">
                            <CalendarDays className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            {isVerifiedDonor ? "Update your availability" : "Easy scheduling at nearby centers."}
                        </li>
                        <li className="flex items-start text-red-500">
                            <BarChart4 className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            {isVerifiedDonor ? "Track your donation history" : "Track your impact over time."}
                        </li>
                    </ul>
                    <button
                        onClick={handleDonorClick}
                        disabled={loading} // ✅ Donor button بھی disabled ہوگا اگر loading true ہے
                        className={`mt-14 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] ${isVerifiedDonor
                            ? 'bg-green-600 text-white cursor-default hover:bg-green-600'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {loading ? (
                            <span className="animate-pulse">Checking...</span>
                        ) : isVerifiedDonor ? (
                            "✅ Already Registered"
                        ) : user ? (
                            "Register as Donor"
                        ) : (
                            "Sign Up to Donate"
                        )}
                    </button>

                    {user && !isVerifiedDonor && (
                        <p className="mt-2 text-sm text-yellow-400 text-center">
                            {isVerifiedPatient ? "⚠️ You must remove patient registration first" : "⚠️ Your account is not yet verified as a donor"}
                        </p>
                    )}

                    {isVerifiedDonor && (
                        <p className="mt-2 text-sm text-green-400 text-center">
                            ✅ Verified donor account
                        </p>
                    )}
                </div>

                {/* PATIENT CARD */}
                <div className="bg-black p-8 max-w-96 rounded-2xl shadow-2xl border-4 border-teal-500 hover:shadow-teal-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <HeartHandshake className="w-10 h-10 text-teal-500" />
                        <h3 className="text-3xl font-bold text-teal-500">
                            {user ? "Patient Portal" : "I Need Blood"}
                        </h3>
                    </div>
                    <p className="text-teal-500 mb-6 flex justify-center">
                        <ShieldUser className="w-12 h-12 text-teal-500" />
                    </p>
                    <ul className="space-y-3 text-teal-500 list-none pl-0">
                        <li className="flex items-start text-teal-500">
                            <Zap className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            {user ? "Submit urgent blood requests" : "Urgent request submission for hospitals."}
                        </li>
                        <li className="flex items-start text-teal-500">
                            <CalendarDays className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            {user ? "Check blood availability" : "Check real-time local blood availability."}
                        </li>
                        <li className="flex items-start text-teal-500">
                            <BarChart4 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            {user ? "Manage your requests" : "Dedicated support for complex blood type needs."}
                        </li>
                    </ul>

                    {/* Patient Button - اب disabled صرف loading کے وقت ہوگا */}
                    <button
                        onClick={handlePatientClick}
                        disabled={loading} // ✅ صرف loading کے وقت disabled
                        className={`mt-8 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] ${isVerifiedPatient
                            ? 'bg-green-600 text-white cursor-default hover:bg-green-600'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                    >
                        {loading ? (
                            <span className="animate-pulse">Checking...</span>
                        ) : isVerifiedPatient ? (
                            "✅ Already Registered"
                        ) : user ? (
                            "Register as Patient"
                        ) : (
                            "Sign In to Request"
                        )}
                    </button>

                    {/* Show patient registration status */}
                    {user && !isVerifiedPatient && (
                        <p className="mt-2 text-sm text-yellow-400 text-center">
                            {isVerifiedDonor ? "⚠️ You must remove donor registration first" : "⚠️ Not registered as patient"}
                        </p>
                    )}

                    {isVerifiedPatient && (
                        <p className="mt-2 text-sm text-green-400 text-center">
                            ✅ Registered patient
                        </p>
                    )}

                    {/* Loading indicator - Only show when actually loading */}
                    {loading && (
                        <p className="mt-2 text-xs text-blue-400 text-center animate-pulse">
                            Checking status...
                        </p>
                    )}

                    {/* Debug info */}
                    <div className="mt-2 text-xs text-gray-400 text-center">
                        <p>Debug: Loading = {loading ? 'true' : 'false'}</p>
                        <p>onPatientRegistrationShow = {typeof onPatientRegistrationShow}</p>
                        <p>User patient status: {user?.patient === 1 ? 'Registered' : 'Not Registered'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content1_2;