import logo from "./images/1.png";
import background from './images/Navbar_background.png';
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./NotificationDropDown";
import PatientNotifications from "./PatientNotifications";
import NotificationBadge from "./NotificationBadge";

function Navbar({
  onShowSignin,
  ShowDonors,
  showPatients,
  openSignup,
  isLoggedIn,
  onLogout,
  closeOverlays,
  showDonorList
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Check user status when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);

          // Check user roles
          setIsDonor(user.donor === 1);
          setIsPatient(user.patient === 1);

          // Check if user is verified (EITHER as donor OR patient)
          setIsVerified(user.verification === 1);

          console.log("👤 User status check:", {
            donor: user.donor,
            patient: user.patient,
            verification: user.verification,
            isDonor: user.donor === 1,
            isPatient: user.patient === 1,
            isVerified: user.verification === 1
          });

        } catch (err) {
          console.error("Error parsing user data:", err);
          setIsDonor(false);
          setIsPatient(false);
          setIsVerified(false);
        }
      }
    } else {
      setIsDonor(false);
      setIsPatient(false);
      setIsVerified(false);
    }
  }, [isLoggedIn]);

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

  // ✅ Handle donors link click - UPDATED LOGIC
  const handleDonorsClick = (e) => {
    e.preventDefault();

    if (closeOverlays) closeOverlays();
    setShowNotifications(false);

    console.log("🩸 Handling Donors click:", {
      isLoggedIn,
      isDonor,
      isPatient,
      isVerified
    });

    // ✅ NEW LOGIC: If user is logged in (patient OR donor), show donor list
    // If not logged in, show login prompt
    if (isLoggedIn) {
      // If user is verified donor OR patient, show donor list
      if ((isDonor && isVerified) || isPatient) {
        if (typeof showDonorList === 'function') {
          console.log("📋 Showing donor list (user is verified donor OR patient)");
          showDonorList();
        } else {
          console.log("❌ showDonorList function not provided");
          ShowDonors(); // Fallback to original function
        }
      }
      // If user is logged in but not verified donor and not patient, show donor registration
      else {
        console.log("📝 Showing donor registration (user needs to register as donor)");
        ShowDonors(); // Show registration form
      }
    }
    // If not logged in, show sign in
    else {
      console.log("🔐 User not logged in, showing sign in");
      if (onShowSignin) onShowSignin();
    }
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

  // Get user role label
  const getUserRole = () => {
    if (isDonor && isPatient) return "Donor & Patient";
    if (isDonor) return "Donor";
    if (isPatient) return "Patient";
    return "User";
  };

  return (
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
          onClick={(e) => {
            e.preventDefault();
            if (closeOverlays) closeOverlays();
            setShowNotifications(false);
            showPatients();
          }}
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

            {/* Notification Icon - Shown for both verified donors AND patients */}
            {/* Notification Icon - Shown for both verified donors AND patients */}
            {(isDonor && isVerified) || isPatient ? (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 text-white hover:text-gray-300 transition-colors"
                  title={isDonor && isVerified ? "Blood Donation Requests" : "My Blood Requests"}
                >
                  <FaBell className="text-xl" />

                  {/* Show notification badge with count */}
                  {isPatient && (
                    <NotificationBadge patientId={JSON.parse(localStorage.getItem('user'))?.id} />
                  )}

                  {/* For donors, you can also add a badge if you want */}
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
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm font-semibold border-b">
                  {getUserRole()}
                </div>
                <div className={`px-4 py-2 text-sm ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isVerified ? '✅ Verified Account' : '⚠️ Not Verified'}
                </div>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Personal Info
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Change Password
                </button>
                {!isVerified && (
                  <button className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100">
                    ⚠️ Verification Required
                  </button>
                )}
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
  );
}

export default Navbar;