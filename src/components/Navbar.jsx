// Navbar.jsx (اپ ڈیٹ شدہ)
import logo from "./images/1.png";
import background from './images/Navbar_background.png';
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./NotificationDropDown";
import PatientNotifications from "./PatientNotifications";
import NotificationBadge from "./NotificationBadge";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PersonalInformation from "./DonorComponent"; // Import PersonalInformation
import axios from 'axios';

function Navbar({
  onShowSignin,
  ShowDonors,
  showPatients,
  openSignup,
  isLoggedIn,
  onLogout,
  closeOverlays,
  showDonorList,
  onPersonalInfoClick // Add this prop
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [donorStatus, setDonorStatus] = useState('free');
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Check user status when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setIsDonor(user.donor === 1);
          setIsPatient(user.patient === 1);
          setIsVerified(user.verification === 1);

          if (user.status) {
            setDonorStatus(user.status);
          } else {
            setDonorStatus('free');
          }

          if (user.donor === 1 && user.verification === 1) {
            fetchDonorStatus(user.id);
          }
        } catch (err) {
          console.error("Error parsing user data:", err);
          setIsDonor(false);
          setIsPatient(false);
          setIsVerified(false);
          setDonorStatus('free');
        }
      }
    } else {
      setIsDonor(false);
      setIsPatient(false);
      setIsVerified(false);
      setDonorStatus('free');
    }
  }, [isLoggedIn]);

  // Existing useEffect کے بعد یہ اضافہ کریں
  useEffect(() => {
    if (isLoggedIn) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // ... existing code ...

          // ✅ Status change events کو listen کریں
          const handleStatusChange = (event) => {
            if (event.detail && event.detail.userId === user.id) {
              fetchDonorStatus(user.id);
            }
          };

          window.addEventListener('donorStatusChanged', handleStatusChange);

          return () => {
            window.removeEventListener('donorStatusChanged', handleStatusChange);
          };

        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    }
  }, [isLoggedIn]);

  // Fetch donor status
  const fetchDonorStatus = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8789/donor-status/${userId}`);

      if (response.data.success) {
        let status = response.data.status;

        // ✅ Status کو normalize کریں
        if (status === 'active' || status === 'free' || status === null || status === undefined) {
          status = 'free';
        } else if (status === 'busy') {
          status = 'busy';
        } else {
          status = 'free'; // default
        }

        // ✅ State update کریں
        setDonorStatus(status);

        // ✅ localStorage update کریں
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.status = status;
          localStorage.setItem('user', JSON.stringify(userData));

          // ✅ component کی state بھی update کریں
          setIsDonor(userData.donor === 1);
          setIsVerified(userData.verification === 1);
        }

        return status;
      }
    } catch (error) {
      console.error("Error fetching donor status:", error);
      // ✅ Fallback to localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.status) {
        setDonorStatus(userData.status);
        return userData.status;
      }
      setDonorStatus('free');
      return 'free';
    }
  };

  // Handle donor status toggle - UPDATED VERSION
  const handleStatusToggle = async () => {
    if (!isLoggedIn || !isDonor || !isVerified) return;

    try {
      setIsStatusLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const currentUserId = userData.id;
      const newStatus = donorStatus === 'free' ? 'busy' : 'free';

      console.log("🎯 Toggling status:", {
        from: donorStatus,
        to: newStatus,
        userId: currentUserId
      });

      // 1. API call to update status
      const response = await axios.put('http://localhost:8789/update-donor-status', {
        userId: currentUserId,
        status: newStatus
      });

      if (response.data.success) {
        console.log("✅ API update successful:", response.data);

        // 2. IMMEDIATELY update local state
        setDonorStatus(newStatus);

        // 3. Update localStorage with fresh data
        const updatedUserData = {
          ...userData,
          status: newStatus,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        // 4. Force immediate refresh of donor status from API
        const refreshResponse = await axios.get(`http://localhost:8789/donor-status/${currentUserId}`);
        if (refreshResponse.data.success) {
          const confirmedStatus = refreshResponse.data.status || 'free';
          console.log("🔄 Confirmed status from API:", confirmedStatus);
          setDonorStatus(confirmedStatus);

          // Update localStorage again with confirmed status
          const confirmedUserData = {
            ...updatedUserData,
            status: confirmedStatus
          };
          localStorage.setItem('user', JSON.stringify(confirmedUserData));
        }

        // 5. Update component states
        setIsDonor(true);
        setIsVerified(true);

        // 6. Show success message
        alert(`✅ Status changed to ${newStatus === 'free' ? 'Available' : 'Busy'}`);

        // 7. Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('donorStatusUpdated', {
          detail: {
            userId: currentUserId,
            status: newStatus,
            timestamp: new Date().toISOString()
          }
        }));

        // 8. Force component re-render
        setTimeout(() => {
          // Force a state update
          setDonorStatus(prev => prev === 'free' ? 'busy' : 'free');
          setTimeout(() => setDonorStatus(newStatus), 10);
        }, 100);

      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error in handleStatusToggle:", error);
      alert(error.response?.data?.error || "Failed to update status");
    } finally {
      setIsStatusLoading(false);
    }
  };
  // Add this function to your Navbar component
  const forceRefreshStatus = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) return;

    try {
      console.log("🔄 Force refreshing status...");

      // Option 1: Use donor-status endpoint
      const response = await axios.get(`http://localhost:8789/donor-status/${userData.id}`);
      if (response.data.success) {
        const status = response.data.status || 'free';
        console.log("✅ Force refresh result:", status);
        setDonorStatus(status);

        // Update localStorage
        const updatedUser = { ...userData, status };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return status;
      }
    } catch (error) {
      console.error("Force refresh failed:", error);

      // Fallback: Use user-status endpoint
      try {
        const fallbackResponse = await axios.get(`http://localhost:8789/user-status/${userData.id}`);
        if (fallbackResponse.data.success) {
          const status = fallbackResponse.data.user.status || 'free';
          setDonorStatus(status);
          return status;
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }

    return donorStatus;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleMenuItemClick = (action) => {
    setShowDropdown(false);
    if (action === "logout") onLogout();
  };

  // Handle Personal Info Click
  const handlePersonalInfoClick = () => {
    setShowDropdown(false);
    setShowPersonalInfo(true);
  };

  const handleClosePersonalInfo = () => {
    setShowPersonalInfo(false);
  };

  // Handle donors link click
  const handleDonorsClick = (e) => {
    e.preventDefault();

    if (closeOverlays) closeOverlays();
    setShowNotifications(false);

    if (isLoggedIn) {
      if ((isDonor && isVerified) || isPatient) {
        if (typeof showDonorList === 'function') {
          showDonorList();
        } else {
          ShowDonors();
        }
      } else {
        ShowDonors();
      }
    } else {
      if (onShowSignin) onShowSignin();
    }
  };

  const handlePatientLinkClick = (e) => {
    e.preventDefault();
    if (closeOverlays) closeOverlays();
    setShowNotifications(false);
    showPatients();
  };

  const handleScroll = (e, sectionId) => {
    e.preventDefault();

    if (closeOverlays) closeOverlays();
    setShowNotifications(false);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const checkDonorStatus = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;

    console.log("🔍 Checking donor status:", {
      userId: userData.id,
      currentStatus: donorStatus,
      localStorageStatus: userData.status,
      isDonor: userData.donor,
      isVerified: userData.verification
    });

    try {
      // ✅ Direct API call سے verify کریں
      const response = await axios.get(`http://localhost:8789/user-status/${userData.id}`);
      console.log("✅ API Status Response:", response.data);

      if (response.data.success) {
        const apiStatus = response.data.user.status;
        console.log("API Status:", apiStatus);

        // ✅ اگر API status مختلف ہے تو update کریں
        if (apiStatus !== donorStatus && apiStatus !== userData.status) {
          setDonorStatus(apiStatus || 'free');

          // ✅ localStorage update کریں
          userData.status = apiStatus || 'free';
          localStorage.setItem('user', JSON.stringify(userData));

          console.log("🔄 Status updated from API:", apiStatus);
        }
      }
    } catch (error) {
      console.error("Debug status check failed:", error);
    }
  };

  // Delete donor/patient data function
  const handleDeleteUserData = async () => {
    try {
      setIsDeleting(true);
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData || !userData.id) {
        alert('User not found. Please login again.');
        return;
      }

      if (!isDonor && !isPatient) {
        alert('You are not registered as donor or patient');
        return;
      }

      const response = await axios.put('http://localhost:8789/delete-user-role-data', {
        userId: userData.id
      });

      if (response.data.success) {
        alert('✅ Your donor/patient data has been deleted successfully!');

        const updatedUser = {
          ...userData,
          ...response.data.user
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setIsDonor(response.data.user.donor === 1);
        setIsPatient(response.data.user.patient === 1);
        setIsVerified(response.data.user.verification === 1);
        setDonorStatus('free');

        window.dispatchEvent(new CustomEvent('userDataDeleted', {
          detail: response.data.user
        }));

        window.dispatchEvent(new Event('storage'));

        setShowDeleteModal(false);
        setShowDropdown(false);

        setTimeout(() => {
          alert('🔄 Page will refresh to update all components...');
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Error deleting user data:', error);
      alert(`Failed to delete data: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get user role label
  const getUserRole = () => {
    if (isDonor && isPatient) return "Donor & Patient";
    if (isDonor) return "Donor";
    if (isPatient) return "Patient";
    return "User";
  };

  // Get status display text
  const getStatusText = () => {
    if (donorStatus === 'free') return 'Available';
    if (donorStatus === 'busy') return 'Busy';
    if (donorStatus === 'active') return 'Active';
    return donorStatus;
  };

  // Get status color
  const getStatusColor = () => {
    if (donorStatus === 'free' || donorStatus === 'active') return 'text-green-600';
    if (donorStatus === 'busy') return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <>
      <header
        style={{ backgroundImage: `url(${background})` }}
        className="flex items-center justify-between px-4 md:px-3 py-3 relative"
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
          <h3
            className="text-white text-xl font-telma cursor-pointer"
            onClick={(e) => handleScroll(e, "home")}
          >
            Hope Drip
          </h3>
        </div>

        <nav className="hidden md:flex gap-6 lg:gap-10 items-center text-white">
          <a href="#home" onClick={(e) => handleScroll(e, "home")} className="hover:text-gray-300">
            Home
          </a>

          <a
            href="#donors"
            onClick={handleDonorsClick}
            className="hover:text-gray-300"
            title={isLoggedIn ? (isDonor && isVerified ? "View Donor List" : "View Donor List") : "View Donors"}
          >
            Donors
          </a>

          <a
            href="#patient"
            onClick={handlePatientLinkClick}
            className="hover:text-gray-300"
          >
            Patient
          </a>

          <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="hover:text-gray-300">
            Contact
          </a>

          <a href="#about" onClick={(e) => handleScroll(e, "about")} className="hover:text-gray-300">
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4 lg:gap-5" ref={dropdownRef}>
          {!isLoggedIn ? (
            <>
              <button
                className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border hover:bg-[#3B341F] transition duration-300"
                onClick={onShowSignin}
              >
                SIGN IN
              </button>
              <button
                className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border hover:bg-[#3B341F] transition duration-300"
                onClick={openSignup}
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* User status info */}
              <div className="text-xs text-white mr-2">
                <div className="font-semibold">{getUserRole()}</div>
                <div className={`text-xs ${isVerified ? 'text-green-300' : 'text-yellow-300'}`}>
                  {isVerified ? '✅ Verified' : '⚠️ Not Verified'}
                </div>
              </div>

              {/* Notification Icon */}
              {(isDonor && isVerified) || isPatient ? (
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-white hover:text-gray-300 transition-colors"
                    title={isDonor && isVerified ? "Blood Donation Requests" : "My Blood Requests"}
                  >
                    <FaBell className="text-xl" />

                    {isPatient && (
                      <NotificationBadge patientId={JSON.parse(localStorage.getItem('user'))?.id} />
                    )}

                    {isDonor && isVerified && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      {isDonor && isVerified && <NotificationDropdown />}
                      {isPatient && <PatientNotifications />}
                    </>
                  )}
                </div>
              ) : null}

              {/* User Profile Icon */}
              <button
                className="bg-transparent text-white rounded-md hover:scale-110 transition-transform duration-200"
                onClick={toggleDropdown}
              >
                <FaUserCircle className="text-3xl" />
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm font-semibold border-b">
                    {getUserRole()}
                  </div>
                  <div className={`px-4 py-2 text-sm ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isVerified ? '✅ Verified Account' : '⚠️ Not Verified'}
                  </div>

                  {/* Donor Status Toggle in Dropdown */}

                  {isDonor && isVerified && (
                    <div className="px-4 py-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          My Status:
                          <span className={`ml-1 ${getStatusColor()}`}>
                            {getStatusText()}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Simple page reload
                              const userData = JSON.parse(localStorage.getItem('user'));
                              const newStatus = donorStatus === 'free' ? 'busy' : 'free';

                              axios.put('http://localhost:8789/update-donor-status', {
                                userId: userData.id,
                                status: newStatus
                              })
                                .then(() => {
                                  // Just reload the page
                                  window.location.reload();
                                })
                                .catch(error => {
                                  console.error(error);
                                  alert("Failed to update");
                                });
                            }}
                            className={`relative inline-flex items-center h-5 rounded-full w-10 transition-colors ${donorStatus === 'free' ? 'bg-green-500' : 'bg-red-500'}`}
                          >
                            <span className={`inline-block w-3 h-3 transform bg-white rounded-full ${donorStatus === 'free' ? 'translate-x-1' : 'translate-x-6'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Personal Info Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onPersonalInfoClick) {
                        onPersonalInfoClick();
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Personal Information
                  </button>


                  {!isVerified && (
                    <button className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100">
                      ⚠️ Verification Required
                    </button>
                  )}

                  <div className="border-t my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Me as {getUserRole()}
                  </button>

                  <div className="border-t my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => handleMenuItemClick("logout")}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <button className="md:hidden text-white text-2xl">☰</button>
      </header>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUserData}
        userRole={getUserRole()}
      />

      {/* Personal Information Modal */}
      {showPersonalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-4xl px-4">
            <PersonalInformation
              userId={JSON.parse(localStorage.getItem('user'))?.id}
              onClose={handleClosePersonalInfo}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;