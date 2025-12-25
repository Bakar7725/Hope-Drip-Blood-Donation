import React, { useState, useEffect } from "react";
import PatientRequestCard from "./DonorCard";
import axios from "axios";

const Content1_3 = () => {
  // ---------------- STATE ----------------
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBlood, setSelectedBlood] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [availableBloodGroups, setAvailableBloodGroups] = useState([]);

  // ---------------- FETCH REAL DATA ----------------
  useEffect(() => {
    fetchDonors();
    fetchFilterOptions();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("📡 Fetching verified donors from backend...");
      const response = await axios.get("http://localhost:8789/verified-donors", {
        timeout: 10000
      });

      if (response.data.success) {
        console.log(`✅ Found ${response.data.count} verified donors`);
        setDonors(response.data.donors);
        setFilteredDonors(response.data.donors);
      } else {
        setError("Failed to load donors. Please try again.");
        console.error("❌ API error:", response.data.error);
      }
    } catch (err) {
      console.error("❌ Error fetching donors:", err);
      setError("Failed to connect to server. Please check your connection.");

      // Fallback to dummy data if server fails
      const DUMMY_DATA = [
        {
          id: 1,
          name: "Ali Khan",
          username: "ali_k99",
          city: "Lahore",
          address: "House 12, Street 5, Gulberg III",
          bloodGroup: "O+",
          phone: "0300-1234567",
          age: 28,
          gender: "Male",
          status: "free"
        },
        {
          id: 7,
          name: "Ahsan Ali",
          username: "ahsan123",
          city: "Gujranwala",
          address: "Gujranwala Model Town",
          bloodGroup: "AB+",
          phone: "03299456900",
          age: 18,
          gender: "Male",
          status: "free"
        }
      ];
      setDonors(DUMMY_DATA);
      setFilteredDonors(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Fetch distinct cities
      const citiesResponse = await axios.get("http://localhost:8789/donor-cities");
      if (Array.isArray(citiesResponse.data)) {
        setAvailableCities(citiesResponse.data);
      }

      // Extract blood groups from donors
      if (donors.length > 0) {
        const bloodGroups = [...new Set(donors.map(donor => donor.bloodGroup).filter(Boolean))];
        setAvailableBloodGroups(bloodGroups);
      }
    } catch (err) {
      console.error("❌ Error fetching filter options:", err);
    }
  };

  // ---------------- FILTER LOGIC ----------------
  useEffect(() => {
    const filtered = donors.filter((donor) => {
      const cityMatch = selectedCity ? donor.city === selectedCity : true;
      const bloodMatch = selectedBlood ? donor.bloodGroup === selectedBlood : true;
      return cityMatch && bloodMatch;
    });
    setFilteredDonors(filtered);
  }, [selectedCity, selectedBlood, donors]);

  // Extract available cities and blood groups from current donors
  useEffect(() => {
    if (donors.length > 0) {
      const cities = [...new Set(donors.map(donor => donor.city).filter(Boolean))].sort();
      const bloodGroups = [...new Set(donors.map(donor => donor.bloodGroup).filter(Boolean))].sort();
      setAvailableCities(cities);
      setAvailableBloodGroups(bloodGroups);
    }
  }, [donors]);

  // ---------------- RENDER ----------------
  return (
    <div className="w-full h-full bg-[#0D1426] px-6 py-8 overflow-hidden">


      {/* ================= FILTER PANEL ================= */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className="
            bg-[#111A2E]
            border border-[#1F2A44]
            rounded-2xl
            p-6
            flex
            flex-col
            lg:flex-row
            gap-6
            items-end
            justify-between
          "
        >
          {/* City Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-1/3">
            <label className="text-sm text-gray-400 font-medium">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="
                bg-[#2C2B3C]
                text-white
                px-4 py-3
                rounded-lg
                outline-none
                border border-[#3A3950]
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                transition
              "
              disabled={loading}
            >
              <option value="">All Cities</option>
              {availableCities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-1/3">
            <label className="text-sm text-gray-400 font-medium">
              Blood Group
            </label>
            <select
              value={selectedBlood}
              onChange={(e) => setSelectedBlood(e.target.value)}
              className="
                bg-[#2C2B3C]
                text-white
                px-4 py-3
                rounded-lg
                outline-none
                border border-[#3A3950]
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                transition
              "
              disabled={loading}
            >
              <option value="">All Groups</option>
              {availableBloodGroups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full lg:w-1/3">
            <button
              onClick={() => {
                setSelectedCity("");
                setSelectedBlood("");
              }}
              className="
                w-full
                bg-gray-700 hover:bg-gray-600
                text-white
                px-4 py-3
                rounded-lg
                font-semibold
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={loading}
            >
              Clear Filters
            </button>

            <button
              onClick={fetchDonors}
              className="
                w-full
                bg-red-600 hover:bg-red-500
                text-white
                px-4 py-3
                rounded-lg
                font-semibold
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= ERROR/LOADING MESSAGES ================= */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchDonors}
            className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="max-w-7xl mx-auto mb-6 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-400">Loading verified donors from database...</p>
        </div>
      )}

      {/* ================= CARD GRID ================= */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-8
          max-w-7xl
          mx-auto
          max-h-[70vh]
          overflow-y-auto
          pr-2
          pb-20
          pt-10
          mb-20
        "
      >
        {!loading && filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <PatientRequestCard
              key={donor.id}
              patientData={donor}
              isRealData={true}
            />
          ))
        ) : !loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              No verified donors found {selectedCity || selectedBlood ? "for selected filters" : "in the database"}
            </p>
            {(selectedCity || selectedBlood) && (
              <button
                onClick={() => {
                  setSelectedCity("");
                  setSelectedBlood("");
                }}
                className="text-red-400 hover:text-red-300 underline"
              >
                Clear filters to see all donors
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* ================= DEBUG INFO (optional) ================= */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-xs text-gray-400 p-3 rounded-lg border border-gray-800">
          <div>Total Donors: {donors.length}</div>
          <div>Filtered: {filteredDonors.length}</div>
          <div>Backend: http://localhost:8789</div>
          <button
            onClick={fetchDonors}
            className="mt-2 text-blue-400 hover:text-blue-300 text-xs"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Content1_3;