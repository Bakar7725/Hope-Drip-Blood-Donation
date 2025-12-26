import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Content from './components/content_1';
import Content1_2 from './components/content_1.2';
import Content4 from './components/Donors.jsx';
import Patient from './components/Patients.jsx';
import PatientRegistration from './components/PatientRegistration';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer.jsx';
import AuthWrapper from './components/AuthWrapper';
import DonorRegistrationFOrm from './components/DonorRegisterForm.jsx';
import NoofBlood from './components/NoofBlood.jsx';
import PersonalInformation from './components/PersonalInformation';
import BloodDonationSlider from './components/BloodDonationSlider';

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDonors, setShowDonors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [showPatientRegistration, setShowPatientRegistration] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDonorForm, setshowDonorForm] = useState(false);
  const [showFullPersonalInfo, setShowFullPersonalInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [showDonorList, setShowDonorList] = useState(false);
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const [showDonorPopup, setShowDonorPopup] = useState(false);

  // NEW STATES FOR THE POPUPS
  const [showDonorRequirementPopup, setShowDonorRequirementPopup] = useState(false);
  const [showPatientRequirementPopup, setShowPatientRequirementPopup] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
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

    const handleUserUpdated = (event) => {
      console.log('🔄 User updated event received in App.js');
      if (event.detail) {
        setUser(event.detail);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdated);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
  }, []);

  // ✅ Function to handle Personal Information click
  const handlePersonalInfoClick = () => {
    console.log("📋 Personal Information clicked");
    setAuthMessage("");
    closeAllPages();
    setShowFullPersonalInfo(true);
  };

  const handleShowDonorList = () => {
    console.log("📋 Showing donor list...");
    setShowDonorList(true);
    setShowDonors(true);
    closeAllPopups();
  };

  useEffect(() => {
    if (showSignin || showRegister) {
      // Save the current scroll position
      const scrollY = window.scrollY;

      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Return cleanup function
      return () => {
        // Restore scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showSignin, showRegister]); // Run when showSignin or showRegister changes


  const onLoginSuccess = (userData) => {
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
    closeAllPages();
    closeAllPopups();
  };

  // Handle Donors Click - Show popup if user is not registered as patient
  const handleDonorsClick = () => {
    console.log("🩸 Donors clicked, user status:", {
      isLoggedIn,
      donor: user?.donor,
      patient: user?.patient,
      verification: user?.verification
    });

    setAuthMessage("");
    closeAllPages();
    closeAllPopups();

    if (!isLoggedIn) {
      setAuthMessage("Please sign in to view donors");
      setShowSignin(true);
      return;
    }

    // Check if user is registered as patient
    if (user?.patient === 1) {
      // User is patient - show donor list
      console.log("✅ User is patient, showing donor list");
      setShowDonors(true);
      setShowDonorList(true);
    } else {
      // User is NOT registered as patient - show popup
      console.log("⚠️ User is not registered as patient - showing popup");
      setShowPatientRequirementPopup(true);
    }
  };

  // Handle Patients Click - Show popup if user is not registered as donor
  const handlePatientsClick = () => {
    console.log("🏥 Patients clicked, user status:", {
      isLoggedIn,
      verification: user?.verification,
      donor: user?.donor
    });

    setAuthMessage("");
    closeAllPages();
    closeAllPopups();

    if (!isLoggedIn) {
      setAuthMessage("Please sign in to access patient features");
      setShowSignin(true);
      return;
    }

    // Check if user is registered as donor and verified
    if (user?.donor === 1 && user?.verification === 1) {
      // User is verified donor - show patient page
      console.log("✅ User is verified donor, showing patient page");
      setShowPatients(true);
    } else {
      // User is NOT registered as donor or not verified - show popup
      console.log("⚠️ User not registered as donor or not verified - showing popup");
      setShowDonorRequirementPopup(true);
    }
  };

  // Function to open patient registration from popup
  const handleOpenPatientRegistrationFromPopup = () => {
    setShowPatientRequirementPopup(false);
    setShowPatientRegistration(true);
  };

  // Function to open donor registration from popup
  const handleOpenDonorRegistrationFromPopup = () => {
    setShowDonorRequirementPopup(false);
    setshowDonorForm(true);
  };

  const handleBecomeDonorAction = () => {
    console.log("🎯 User wants to become a donor");
    setShowDonorPopup(false);
    setshowDonorForm(true);
  };

  const handlePatientRegistrationShow = () => {
    console.log("🏥 handlePatientRegistrationShow called, user:", user);

    if (!user) {
      setAuthMessage("Please sign in to register as a patient");
      setShowSignin(true);
      return;
    }

    // SIMPLE CHECK: Only check if already patient
    if (user.patient === 1) {
      setAuthMessage("✅ You are already registered as a patient");
      setTimeout(() => setAuthMessage(""), 3000);
      setShowPatients(true);
      setShowPatientRegistration(false);
    } else {
      console.log("✅ Opening patient registration form");
      setShowPatientRegistration(true);
      closeAllPages();
      closeAllPopups();
    }
  };

  const handlePatientRegistrationSuccess = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData,
      patient: 1
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setAuthMessage("✅ Patient registration successful! You can now submit blood requests.");
    setShowPatientRegistration(false);
    setShowPatients(true);

    setTimeout(() => {
      setAuthMessage("");
    }, 3000);
  };

  const handleDonorRegistrationSuccess = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData,
      donor: 1,
      verification: 1
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setAuthMessage("✅ Donor profile completed! Your account is now verified.");
    setshowDonorForm(false);

    setTimeout(() => {
      setAuthMessage("");
    }, 2000);
  };

  const handlePatientRegistrationClose = () => {
    setShowPatientRegistration(false);
    setAuthMessage("");
  };

  const closeAllPages = () => {
    setShowDonors(false);
    setShowPatients(false);
    setShowPatientRegistration(false);
    setshowDonorForm(false);
    setShowFullPersonalInfo(false);
    setShowDonorList(false);
    setShowDonationHistory(false);
    setShowDonorPopup(false);
    setAuthMessage("");
  };

  // Function to close all popups
  const closeAllPopups = () => {
    setShowPatientRequirementPopup(false);
    setShowDonorRequirementPopup(false);
  };

  // Function to close Personal Information
  const handleClosePersonalInfo = () => {
    setShowFullPersonalInfo(false);
  };

  return (
    <div className="App bg-black min-h-screen flex flex-col">
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
        onPersonalInfoClick={handlePersonalInfoClick}

      />



      {/* Popup for "Donor" link - Requires Patient Registration */}
      {showPatientRequirementPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-teal-500 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPatientRequirementPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.206 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-teal-500 mb-2">
                Patient Registration Required
              </h3>
              <p className="text-gray-300 mb-4">
                To view the donor list, you must first register as a <span className="font-bold text-teal-400">patient</span>.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-3">
                <span className="font-bold">Why this restriction?</span>
              </p>
              <ul className="text-gray-400 text-sm space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  Only registered patients can view donor information
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  This ensures that only genuine patients can contact donors
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  Protects donor privacy and security
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  Registering as patient helps us track blood requests
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleOpenPatientRegistrationFromPopup}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Register as Patient
              </button>
              <button
                onClick={() => setShowPatientRequirementPopup(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for "Patient" link - Requires Donor Registration */}
      {showDonorRequirementPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowDonorRequirementPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">
                Donor Registration Required
              </h3>
              <p className="text-gray-300 mb-4">
                To view patient blood requests, you need to be a <span className="font-bold text-red-400">verified donor</span>.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-3">
                <span className="font-bold">Why this restriction?</span>
              </p>
              <ul className="text-gray-400 text-sm space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Only verified donors can view patient blood requests
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  This ensures security and proper blood management
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Patient privacy is our top priority
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Once verified, you can see all patient requests
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleOpenDonorRegistrationFromPopup}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Register as Donor
              </button>
              <button
                onClick={() => setShowDonorRequirementPopup(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
      {showDonorForm && (
        <div className="flex-grow">
          <div id="donor-registration">
            <DonorRegistrationFOrm
              onClose={() => {
                setshowDonorForm(false);
                setAuthMessage("");
              }}
              onSuccess={handleDonorRegistrationSuccess}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showDonors && !showPatients && !showPatientRegistration && !showDonorForm && !showDonationHistory && !showDonorPopup && !showFullPersonalInfo && !showPatientRequirementPopup && !showDonorRequirementPopup && (
        <div className="flex-grow">
          <div id="home"><Content /></div>
          <div><BloodDonationSlider /></div>
          <div id="content3">
            <Content1_2
              A={() => {
                setAuthMessage("");
                setShowSignin(true);
              }}
              B={() => {
                setAuthMessage("");
                setshowDonorForm(true);
                console.log("QQQQQQQQQQQQQQQQQ");
              }}
              C={() => {
                handleOpenPatientRegistrationFromPopup()
                console.log("Popup");
              }}

              user={user}
              setUser={setUser}
              showPatientRegistration={showPatientRegistration}
              onPatientRegistrationClose={handlePatientRegistrationClose}
              onPatientRegistrationShow={handlePatientRegistrationShow}
            />
          </div>
          <div><NoofBlood /></div>
          <div id="about"><About /></div>
          <div id="contact"><Contact /></div>
        </div>
      )}

      {/* Personal Information Component */}
      {showFullPersonalInfo && user && (
        <div className="flex-grow bg-gray-50 min-h-screen">
          <PersonalInformation
            userId={user.id}
            onClose={() => setShowFullPersonalInfo(false)}
          />
        </div>
      )}

      {/* Donors Page */}
      {showDonors && (
        <div className="flex-grow">
          <div id="donors">
            <Content4 />
          </div>
        </div>
      )}

      {/* Patient Requests Page */}
      {showPatients && (
        <div className="flex-grow">
          <div id="patients">
            <Patient />
          </div>
        </div>
      )}

      {/* Donation History Page */}
      {showDonationHistory && (
        <div className="flex-grow">
          <div id="donation-history">
            <Patient />
          </div>
        </div>
      )}

      {/* Patient Registration Page - NOW SHOULD SHOW */}
      {showPatientRegistration && (
        <div className="flex-grow">
          <div id="patient-registration">
            <PatientRegistration
              user={user}
              onClose={handlePatientRegistrationClose}
              onSuccess={handlePatientRegistrationSuccess}
            />
          </div>
        </div>
      )}

      {/* Footer - Always show at bottom */}
      <Footer />
    </div>
  );
}

export default App;