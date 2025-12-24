import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Content from './components/content_1'; 
import Content2 from './components/content_1.1';
import Content3 from './components/content_1.2';
import Content4 from './components/content_1.3';
import Signin from './components/Signin.jsx';
import DonorPatient from './components/DonorPatient';
import Patient from './components/Patients';
import Contact from './components/Contact';
import About from './components/About';
import SignupModal from './components/Signup';
import Footer from './components/Footer.jsx';

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDonors, setShowDonors] = useState(false); // ✅ Fixed typo: setShowDOnors → setShowDonors
  const [showPatients, setShowPatients] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status on app load
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  function ShowSigninForm() {
    setShowSignin(true);
  }
  
  function hideSigninForm() {
    setShowSignin(false);
  }

  function openRegister() {
    setShowRegister(true);
  }
  
  function closeRegister() {
    setShowRegister(false);
  }

  function onShowDonors() {
    setShowDonors(true);
  }
  
  function onHideDonors() {
    setShowDonors(false);
  }

  function onShowPatients() {
    setShowPatients(true);
  }
  
  function onHidePatients() {
    setShowPatients(false);
  }

  const [showSignup, setShowSignup] = useState(false);

  function openSignup() {
    setShowSignup(true);
  }

  function closeSignup() {
    setShowSignup(false);
  }

  // ✅ Login success handler
  function onLoginSuccess() {
    setIsLoggedIn(true);
    setShowSignin(false); // Close signin modal after successful login
  }

  // ✅ Logout function
  function handleLogout() {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // Optional: Show logout success message
    console.log("User logged out successfully");
  }

  // ✅ Signup success handler (agar SignupModal se callback chahiye)
  function onSignupSuccess() {
    setShowSignup(false);
    // Optional: Show success message or auto-login
    console.log("User registered successfully");
  }

  return (
    <div className="App">
      <Navbar 
        onShowSignin={ShowSigninForm}
        ShowDonors={onShowDonors}
        showPatients={onShowPatients}
        openSignup={openSignup}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Modals */}
      {showSignin && (
        <Signin 
          onClose={hideSigninForm} 
          onLoginSuccess={onLoginSuccess} 
          onShowSignup={openSignup} // ✅ Agar signin modal se signup par jaana hai
        />
      )}
      
      {showDonors && <Content4 onClose={onHideDonors} />}
      
      {showPatients && <Patient onClose={onHidePatients} />}
      
      {showSignup && (
        <SignupModal 
          onClose={closeSignup} 
          onShowSignin={ShowSigninForm}
          onSignupSuccess={onSignupSuccess} // ✅ Optional: Agar success callback chahiye
        />
      )}

      {/* Page Sections */}
      <div id="home">
        <Content />
      </div>
      
      {/* <div id="content2">
        <Content2 />
      </div> */}
      
      <div id="content3">
        <Content3 A={openRegister} />
        {showRegister && <DonorPatient B={closeRegister} />}
      </div>
      
      
      <div id="about">
        <About />
      </div>

      <div id="contact">
        <Contact />
      </div>

      <div>
        <Footer />
      </div>
      
    </div>
  );
}

export default App;