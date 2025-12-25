import React from 'react';
import bg from "./images/content1.2.jpg";
import { Droplet, HeartHandshake, Zap, CalendarDays, BarChart4, Hospital, ShieldUser } from 'lucide-react';

function Content1_2({
    A,
    B,
    user,
    showPatientRegistration,
    onPatientRegistrationClose,
    onPatientRegistrationShow
}) {
    const [isVerifiedDonor, setIsVerifiedDonor] = React.useState(false);
    const [isVerifiedPatient, setIsVerifiedPatient] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Function to check patient status from API
    const checkPatientStatus = React.useCallback(async () => {
        if (user && user.id) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8789/check-patient/${user.id}`);
                const data = await response.json();

                if (data.success) {
                    console.log("🩺 Patient status from API:", {
                        isPatient: data.isPatient,
                        patient: data.patient,
                        patient_status: data.patient_status
                    });

                    setIsVerifiedPatient(data.isPatient);

                    // If API says user is patient but local storage doesn't, update localStorage
                    if (data.isPatient && user.patient !== 1) {
                        console.log("🔄 Updating localStorage with patient status...");
                        const updatedUser = {
                            ...user,
                            patient: data.patient || 1,
                            patient_status: data.patient_status || 'active'
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));

                        // Trigger a reload of user data in parent component
                        window.dispatchEvent(new Event('storage'));
                    }
                }
            } catch (error) {
                console.error("❌ Error checking patient status:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    React.useEffect(() => {
        console.log("🔍 Current user object in Content1_2:", user);

        if (user) {
            // Check donor status - verified if verification=1 AND donor=1
            const donorVerified = user.verification === 1 && user.donor === 1;
            setIsVerifiedDonor(donorVerified);

            // Check patient status - UPDATED LOGIC
            console.log("🩺 Patient check results:", {
                id: user.id,
                donor: user.donor,
                patient: user.patient,
                patient_status: user.patient_status,
                verification: user.verification,
                medical_condition: user.medical_condition,
                emergency_contact: user.emergency_contact,
                hospital_name: user.hospital_name
            });

            // Check if user has ANY patient-related data
            const hasPatientData =
                user.patient === 1 ||
                user.patient_status === 'active' ||
                user.patient_status === 'pending' ||
                user.medical_condition ||
                user.emergency_contact ||
                user.hospital_name;

            console.log("📊 Patient check summary:", {
                patientField: user.patient,
                patientStatusField: user.patient_status,
                hasPatientFields: user.medical_condition || user.emergency_contact,
                hasPatientData: hasPatientData
            });

            if (hasPatientData) {
                setIsVerifiedPatient(true);
                console.log("✅ Patient detected from user data");
            } else {
                // Check with API if no patient data locally
                console.log("🔍 No patient data locally, checking API...");
                checkPatientStatus();
            }
        } else {
            setIsVerifiedDonor(false);
            setIsVerifiedPatient(false);
        }
    }, [user, checkPatientStatus]);

    // Listen for localStorage updates
    React.useEffect(() => {
        const handleStorageChange = () => {
            console.log("📦 localStorage changed, reloading user data...");
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const updatedUser = JSON.parse(userData);
                    console.log("🔄 Updated user from localStorage:", {
                        patient: updatedUser.patient,
                        patient_status: updatedUser.patient_status
                    });

                    // Update local state
                    const donorVerified = updatedUser.verification === 1 && updatedUser.donor === 1;
                    setIsVerifiedDonor(donorVerified);

                    const hasPatientData =
                        updatedUser.patient === 1 ||
                        updatedUser.patient_status === 'active' ||
                        updatedUser.patient_status === 'pending' ||
                        updatedUser.medical_condition ||
                        updatedUser.emergency_contact;

                    setIsVerifiedPatient(hasPatientData);
                } catch (err) {
                    console.error("Error parsing updated user:", err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleDonorClick = (e) => {
        e.preventDefault();

        if (isVerifiedDonor) {
            alert("✅ You are already a registered and verified donor!");
            return;
        }

        if (user) {
            B(); // Donor registration form
        } else {
            A(); // Sign in
        }
    };

    const handlePatientClick = (e) => {
        e.preventDefault();

        console.log("🩺 Patient button clicked, isVerifiedPatient:", isVerifiedPatient);

        if (isVerifiedPatient) {
            alert("✅ You are already a registered patient!");
            return;
        }

        if (user) {
            // Call parent function to show patient registration
            if (typeof onPatientRegistrationShow === 'function') {
                onPatientRegistrationShow();
            }
        } else {
            A(); // Sign in
        }
    };

    const handleRefreshPatientStatus = () => {
        console.log("🔄 Manually refreshing patient status...");
        checkPatientStatus();
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
                        disabled={isVerifiedDonor}
                        className={`mt-14 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] ${isVerifiedDonor
                            ? 'bg-green-600 text-white cursor-default hover:bg-green-600'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {isVerifiedDonor ? (
                            <>
                                ✅ Already Registered
                            </>
                        ) : user ? (
                            "Register as Donor"
                        ) : (
                            "Sign Up to Donate"
                        )}
                    </button>

                    {user && !isVerifiedDonor && (
                        <p className="mt-2 text-sm text-yellow-400 text-center">
                            ⚠️ Your account is not yet verified as a donor
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
                    <button
                        onClick={handlePatientClick}
                        disabled={isVerifiedPatient}
                        className={`mt-8 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] ${isVerifiedPatient
                            ? 'bg-green-600 text-white cursor-default hover:bg-green-600'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                    >
                        {isVerifiedPatient ? (
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
                            ⚠️ Not registered as patient
                        </p>
                    )}

                    {isVerifiedPatient && (
                        <p className="mt-2 text-sm text-green-400 text-center">
                            ✅ Registered patient
                        </p>
                    )}

                    {/* Refresh button for debugging */}
                    {user && (
                        <button
                            onClick={handleRefreshPatientStatus}
                            className="mt-2 text-xs text-gray-400 hover:text-white underline"
                        >
                            🔄 Refresh Patient Status
                        </button>
                    )}

                    {/* Debug info - remove in production */}
                    {user && (
                        <div className="mt-4 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
                            <p>Debug Info:</p>
                            <p>User ID: {user.id}</p>
                            <p>Donor: {user.donor}</p>
                            <p>Patient: {user.patient}</p>
                            <p>Patient Status: {user.patient_status || 'null'}</p>
                            <p>Verification: {user.verification}</p>
                            <p>Medical Condition: {user.medical_condition || 'null'}</p>
                            <p>Emergency Contact: {user.emergency_contact || 'null'}</p>
                            <p>Hospital: {user.hospital_name || 'null'}</p>
                            <p>Is Verified Donor: {isVerifiedDonor ? 'Yes' : 'No'}</p>
                            <p>Is Verified Patient: {isVerifiedPatient ? 'Yes' : 'No'}</p>
                            <p>Loading: {loading ? 'Yes' : 'No'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Content1_2;