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

    React.useEffect(() => {
        if (user) {
            setIsVerifiedDonor(user.verification === 1 && user.donor === 1);
            setIsVerifiedPatient(user.patient === 1);
        } else {
            setIsVerifiedDonor(false);
            setIsVerifiedPatient(false);
        }
    }, [user]);

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
                </div>
            </div>
        </div>
    );
}

export default Content1_2;