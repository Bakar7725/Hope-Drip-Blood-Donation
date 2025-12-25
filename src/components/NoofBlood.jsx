import React, { useState, useEffect } from "react";
import { Droplet, Users, User, UserCheck, UserX, RefreshCw } from "lucide-react";

const BloodGroupCard = ({ group, count }) => (
    <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg border-t-4 border-gray-700 hover:border-red-500 transition duration-300">
        <Droplet className="w-10 h-10 mx-auto mb-3 text-red-600" />
        <p className="text-4xl font-extrabold text-white">{count}</p>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {group} Donors
        </p>
    </div>
);

const StatisticsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const AvailableDonorsSection = () => {
    const [bloodGroupData, setBloodGroupData] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Fetching dashboard data...');

            // Try test endpoint first
            console.log('📡 Testing connection...');
            const testResponse = await fetch('http://localhost:8789/test-dashboard');
            console.log('✅ Test endpoint response:', testResponse.status);

            if (testResponse.ok) {
                const testData = await testResponse.json();
                console.log('✅ Test data received:', testData);
            }

            // Fetch blood group counts
            console.log('📡 Fetching blood group counts...');
            const countsResponse = await fetch('http://localhost:8789/blood-group-counts');
            console.log('✅ Blood group API status:', countsResponse.status);

            if (!countsResponse.ok) {
                throw new Error(`Blood group API error: ${countsResponse.status}`);
            }

            const countsData = await countsResponse.json();
            console.log('📊 Blood group data:', countsData);

            // Fetch statistics
            console.log('📡 Fetching statistics...');
            const statsResponse = await fetch('http://localhost:8789/donor-statistics');
            console.log('✅ Statistics API status:', statsResponse.status);

            if (!statsResponse.ok) {
                throw new Error(`Statistics API error: ${statsResponse.status}`);
            }

            const statsData = await statsResponse.json();
            console.log('📊 Statistics data:', statsData);

            if (countsData.success && statsData.success) {
                console.log('✅ Both APIs successful');

                // Format blood group data
                const formattedData = countsData.bloodGroups.map(item => ({
                    group: item.blood_group,
                    count: item.count
                }));

                console.log('🎯 Formatted blood groups:', formattedData);

                setBloodGroupData(formattedData);
                setStatistics(statsData.statistics);
            } else {
                console.log('⚠️ API returned success: false');
                useFallbackData();
            }
        } catch (err) {
            console.error('❌ Fetch error:', err.message);
            console.log('⚠️ Using fallback data');
            useFallbackData();
            setError(`Connection error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const useFallbackData = () => {
        // Fallback data based on your actual donor (AB+)
        const fallbackBloodGroups = [
            { group: 'O+', count: 0 },
            { group: 'O-', count: 0 },
            { group: 'A+', count: 0 },
            { group: 'A-', count: 0 },
            { group: 'B+', count: 0 },
            { group: 'B-', count: 0 },
            { group: 'AB+', count: 1 },
            { group: 'AB-', count: 0 }
        ];

        const fallbackStats = {
            totalVerified: 1,
            available: 1,
            busy: 0,
            availability: { percentageAvailable: 100 }
        };

        setBloodGroupData(fallbackBloodGroups);
        setStatistics(fallbackStats);
    };

    useEffect(() => {
        console.log('✅ AvailableDonorsSection mounted');
        fetchAllData();
    }, []);

    if (loading) {
        return (
            <section className="bg-[#0D1426] py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <RefreshCw className="w-12 h-12 mx-auto text-red-600 animate-spin" />
                    <p className="mt-4 text-gray-300">Loading donor data...</p>
                    <p className="mt-2 text-sm text-gray-500">Connecting to http://localhost:8789</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#0D1426] py-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header with Patient Registration Title */}
                <div className="bg-gradient-to-r from-teal-900/80 to-emerald-900/80 border-b border-teal-500/30 mb-10 ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Blood Availability Dashboard
                                </h1>
                                <p className="text-teal-200 text-sm mt-1">
                                    Real-time overview of verified donors available for emergency response
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                        <p className="text-yellow-300">⚠️ {error}</p>
                    </div>
                )}

                {/* Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <StatisticsCard
                            title="Total Verified Donors"
                            value={statistics.totalVerified}
                            icon={Users}
                            color="bg-blue-500/20 text-blue-400"
                        />
                        <StatisticsCard
                            title="Available Now"
                            value={statistics.available}
                            icon={UserCheck}
                            color="bg-green-500/20 text-green-400"
                        />
                        <StatisticsCard
                            title="Currently Busy"
                            value={statistics.busy}
                            icon={UserX}
                            color="bg-yellow-500/20 text-yellow-400"
                        />
                        <StatisticsCard
                            title="Availability Rate"
                            value={`${statistics.availability?.percentageAvailable || 0}%`}
                            icon={Droplet}
                            color="bg-red-500/20 text-red-400"
                        />
                    </div>
                )}

                {/* Blood Group Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {bloodGroupData.length > 0 ? (
                        bloodGroupData.map((item) => (
                            <BloodGroupCard key={item.group} group={item.group} count={item.count} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-400">No blood group data available</p>
                        </div>
                    )}
                </div>

                {/* Additional Info */}

            </div>
        </section>
    );
};

export default AvailableDonorsSection;