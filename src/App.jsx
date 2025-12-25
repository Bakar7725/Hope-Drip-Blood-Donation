import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Content from './components/content_1';
import Content1_2 from './components/content_1.2';
import Content4 from './components/Donors.jsx';
import Patient from './components/Patients';
import PatientRegistration from './components/PatientRegistration';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer.jsx';
import AuthWrapper from './components/AuthWrapper';
import PersonalInfoModal from './components/DonorRegisterForm.jsx';
import NoofBlood from './components/NoofBlood.jsx';
import PatientNotifications from "./components/PatientNotifications"; // ✅ ADD THIS LINE

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDonors, setShowDonors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [showPatientRegistration, setShowPatientRegistration] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [showDonorList, setShowDonorList] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Ensure user object has required fields with default values
        const userWithDefaults = {
          ...parsedUser,
          patient: parsedUser.patient || 0,
          donor: parsedUser.donor || 0,
          verification: parsedUser.verification || 0
        };
        setUser(userWithDefaults);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const handleShowDonorList = () => {
    console.log("📋 Showing donor list...");
    setShowDonorList(true);
    setShowDonors(true);
    setShowSignin(false);
    setShowPersonalInfo(false);
    setShowPatientRegistration(false);
  };

  const handleShowDonorForm = () => {
    console.log("📝 Showing donor registration form...");
    setShowPersonalInfo(true);
    setShowDonors(false);
    setShowSignin(false);
    setShowPatientRegistration(false);
  };

  const onLoginSuccess = (userData) => {
    // Ensure user object has all required fields
    const userWithDefaults = {
      ...userData,
      patient: userData.patient || 0,
      donor: userData.donor || 0,
      verification: userData.verification || 0
    };

    localStorage.setItem('user', JSON.stringify(userWithDefaults));
    setUser(userWithDefaults);
    setIsLoggedIn(true);
    setShowSignin(false);
    setShowRegister(false);
    setAuthMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setAuthMessage("");
    // Close all pages
    setShowDonors(false);
    setShowPatients(false);
    setShowPatientRegistration(false);
    setShowPersonalInfo(false);
  };

  // Handle Donor Click - FIXED VERSION
  // Handle Donor Click - UPDATED VERSION for Patients
  const handleDonorsClick = () => {
    console.log("🩸 Donors clicked, user status:", {
      isLoggedIn,
      donor: user?.donor,
      patient: user?.patient,
      verification: user?.verification
    });

    setAuthMessage("");
    closeAllPages();

    if (!isLoggedIn) {
      setAuthMessage("Please sign in to view donors");
      setShowSignin(true);
      return;
    }

    // ✅ NEW LOGIC: If user is patient OR verified donor, show donor list
    if (user) {
      // Check if user is patient
      if (user.patient === 1) {
        console.log("✅ User is patient, showing donor list");
        setShowDonors(true);
        setShowDonorList(true);
        return;
      }

      // Check if user is a verified donor
      if (user.donor === 1 && user.verification === 1) {
        console.log("✅ User is verified donor, showing donor list");
        setShowDonors(true);
        setShowDonorList(true);
        return;
      }
    }

    // If user is logged in but not patient or verified donor, show donor registration
    console.log("⚠️ User needs to register as donor first");
    setAuthMessage("Please complete your donor profile to access donor features");
    setShowPersonalInfo(true);
  };
  // Handle Patient Requests Page
  const handlePatientsClick = () => {
    setAuthMessage("");
    closeAllPages();

    if (!isLoggedIn) {
      setAuthMessage("Please sign in to view patient requests");
      setShowSignin(true);
      return;
    }

    // Check if user is registered as patient
    if (user && user.patient === 1) {
      // User is already registered as patient, show patient requests
      setShowPatients(true);
    } else if (user && user.patient === 0) {
      // User is not registered as patient, show patient registration
      setAuthMessage("Please register as a patient first");
      setShowPatientRegistration(true);
    } else {
      // User data doesn't have patient field
      setShowPatientRegistration(true);
    }
  };

  // Handle Patient Registration from Content1_2
  const handlePatientRegistrationShow = () => {
    if (!user) {
      setAuthMessage("Please sign in to register as a patient");
      setShowSignin(true);
    } else if (user.patient === 1) {
      setAuthMessage("✅ You are already registered as a patient");
      setTimeout(() => setAuthMessage(""), 3000);
      setShowPatients(true); // Show patient requests if already registered
      setShowPatientRegistration(false);
    } else {
      setShowPatientRegistration(true);
      setShowPatients(false);
      setShowDonors(false);
      setShowPersonalInfo(false);
    }
  };

  // Handle Patient Registration Success
  const handlePatientRegistrationSuccess = (updatedUserData) => {
    // Update user data to mark as patient
    const updatedUser = {
      ...user,
      ...updatedUserData,
      patient: 1
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setAuthMessage("✅ Patient registration successful! You can now submit blood requests.");
    setShowPatientRegistration(false);
    setShowPatients(true); // Show patient requests after registration

    setTimeout(() => {
      setAuthMessage("");
    }, 3000);
  };

  // Handle Patient Registration Close
  const handlePatientRegistrationClose = () => {
    setShowPatientRegistration(false);
    setAuthMessage("");
  };

  // Handle Donor Registration Success
  const handleDonorRegistrationSuccess = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData,
      donor: 1,
      verification: 1
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setAuthMessage("✅ Donor profile completed! You can now view donors.");
    setShowPersonalInfo(false);
    setShowDonors(true);
    setShowDonorList(true);

    setTimeout(() => {
      setAuthMessage("");
    }, 2000);
  };

  const closeAllPages = () => {
    setShowDonors(false);
    setShowPatients(false);
    setShowPatientRegistration(false);
    setShowPersonalInfo(false);
    setShowDonorList(false);
    setAuthMessage("");
  };

  return (
    <div className="App bg-black min-h-screen">
      <Navbar
        onShowSignin={() => {
          setAuthMessage("");
          setShowSignin(true);
        }}
        ShowDonors={handleDonorsClick}
        showPatients={handlePatientsClick}
        openSignup={() => {
          setAuthMessage("");
          setShowRegister(true);
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        closeOverlays={closeAllPages}
        showDonorList={handleShowDonorList}
      />

      {/* Authentication Messages */}
      {authMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${authMessage.includes("✅")
            ? "bg-green-600/90 text-white"
            : "bg-yellow-600/90 text-white"
            }`}>
            <span>{authMessage}</span>
            <button
              onClick={() => setAuthMessage("")}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Authentication Modals */}
      {(showSignin || showRegister) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <AuthWrapper
            defaultForm={showRegister ? 'register' : 'login'}
            onLoginSuccess={onLoginSuccess}
            onClose={() => {
              setShowSignin(false);
              setShowRegister(false);
              setAuthMessage("");
            }}
          />
        </div>
      )}

      {/* Donor Registration Modal */}
      {showPersonalInfo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <PersonalInfoModal
            onClose={() => {
              setShowPersonalInfo(false);
              setAuthMessage("");
            }}
            onSuccess={handleDonorRegistrationSuccess}
          />
        </div>
      )}

      {/* Main Content - Only show when no other pages are active */}
      {!showDonors && !showPatients && !showPatientRegistration && !showPersonalInfo && (
        <>
          <div id="home"><Content /></div>

          <div id="content3">
            <Content1_2
              A={() => {
                setAuthMessage("");
                setShowSignin(true);
              }}
              B={() => {
                setAuthMessage("");
                setShowPersonalInfo(true);
              }}
              user={user}
              showPatientRegistration={showPatientRegistration}
              onPatientRegistrationClose={handlePatientRegistrationClose}
              onPatientRegistrationShow={handlePatientRegistrationShow}
            />
          </div>
          <div><NoofBlood /></div>
          <div id="about"><About /></div>
          <div id="contact"><Contact /></div>
          <Footer />
        </>
      )}

      {/* Donors Page */}
      {showDonors && (
        <>
          <div id="donors">
            <Content4 />
          </div>
          <Footer />
        </>
      )}

      {/* Patient Requests Page */}
      {showPatients && (
        <>
          <div id="patients">
            <Patient />
          </div>
          <Footer />
        </>
      )}

      {/* Patient Registration Page */}
      {showPatientRegistration && (
        <div id="patient-registration">
          <PatientRegistration
            user={user}
            onClose={handlePatientRegistrationClose}
            onSuccess={handlePatientRegistrationSuccess}
          />
        </div>
      )}
    </div>
  );
}

export default App;