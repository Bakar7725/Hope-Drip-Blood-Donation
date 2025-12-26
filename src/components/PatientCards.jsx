// Patients.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Patients() {
    const [mode, setMode] = useState("loading"); // patient | donor | error
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ---------------------------------- INIT ---------------------------------- */
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (!data) {
            setMode("error");
            setError("Please login first");
            return;
        }

        const parsed = JSON.parse(data);
        setUser(parsed);

        if (parsed.patient === 1) {
            setMode("patient");
            fetchPatientRequests(parsed.id);
        } else if (parsed.donor === 1 && parsed.verification === 1) {
            setMode("donor");
            fetchDonationHistory(parsed.id);
        } else {
            setMode("error");
            setError("Access not allowed");
        }
    }, []);

    /* ------------------------------- API CALLS ------------------------------- */
    const fetchPatientRequests = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:8789/patient-requests/${id}`
            );
            setRequests(res.data.requests || []);
        } catch {
            setError("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchDonationHistory = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:8789/donor-donation-history/${id}`
            );
            setDonations(res.data.donations || []);
        } catch {
            setError("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------- LOADING -------------------------------- */
    if (mode === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin h-14 w-14 border-4 border-teal-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    /* --------------------------------- ERROR --------------------------------- */
    if (mode === "error") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl text-red-500 font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    /* --------------------------------- HEADER -------------------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
            {/* PROFILE HEADER */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome, <span className="text-teal-400">{user?.name}</span>
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {mode === "patient"
                            ? "Manage your blood requests"
                            : "Your lifesaving donation history"}
                    </p>
                </div>

                <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === "patient"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                >
                    {mode === "patient" ? "🧑 Patient" : "🩸 Verified Donor"}
                </span>
            </div>

            {/* ============================= PATIENT MODE ============================= */}
            {mode === "patient" && (
                <div className="max-w-7xl mx-auto space-y-6">
                    {requests.length === 0 ? (
                        <EmptyCard text="No blood requests sent yet." />
                    ) : (
                        requests.map((r, i) => (
                            <Card key={i}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-teal-300">
                                            Donor: {r.donor_name}
                                        </h3>
                                        <p className="text-gray-400 mt-1">
                                            🩸 {r.donor_blood_group} • 📍 {r.donor_city}
                                        </p>
                                    </div>

                                    <StatusBadge status={r.request_status} />
                                </div>

                                <div className="mt-4 text-sm text-gray-400">
                                    📞 {r.donor_phone || "N/A"}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* ============================== DONOR MODE ============================== */}
            {mode === "donor" && (
                <>
                    {/* STATS */}
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <Stat title="Total Donations" value={donations.length} />
                        <Stat
                            title="Male Patients"
                            value={donations.filter(d => d.patient?.gender === "Male").length}
                        />
                        <Stat
                            title="Female Patients"
                            value={donations.filter(d => d.patient?.gender === "Female").length}
                        />
                        <Stat
                            title="Cities Helped"
                            value={new Set(donations.map(d => d.patient?.city)).size}
                        />
                    </div>

                    {/* LIST */}
                    <div className="max-w-7xl mx-auto space-y-6">
                        {donations.length === 0 ? (
                            <EmptyCard text="No donation history yet." />
                        ) : (
                            donations.map((d, i) => (
                                <Card key={i}>
                                    <h3 className="text-xl font-semibold text-teal-300">
                                        {d.patient?.name}
                                    </h3>
                                    <p className="text-gray-400 mt-1">
                                        🩸 {d.patient?.blood_group} • 🎂 {d.patient?.age}
                                    </p>
                                    <p className="text-gray-400 mt-1">
                                        🏥 {d.patient?.hospital_name}
                                    </p>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

/* =============================== UI PARTS =============================== */

const Card = ({ children }) => (
    <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 hover:border-teal-500 transition">
        {children}
    </div>
);

const EmptyCard = ({ text }) => (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-16 text-center text-gray-400">
        {text}
    </div>
);

const Stat = ({ title, value }) => (
    <div className="bg-gray-900 border border-teal-700 rounded-xl p-6 text-center">
        <div className="text-3xl font-bold text-teal-400">{value}</div>
        <div className="text-gray-400 mt-1">{title}</div>
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        accepted: "bg-green-500/20 text-green-400",
        rejected: "bg-red-500/20 text-red-400",
        inprogress: "bg-yellow-500/20 text-yellow-400",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || "bg-gray-500/20 text-gray-400"
                }`}
        >
            {status?.toUpperCase()}
        </span>
    );
};
