import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Content from './components/content_1';
import Content3 from './components/content_1.2';
import Content4 from './components/content_1.3';
import Patient from './components/Patients';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer.jsx';
import AuthWrapper from './components/AuthWrapper'; // ✅ New combined modal

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDonors, setShowDonors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    console.log("User logged out successfully");
  };

  return (
    <div className="App">
      <Navbar
        onShowSignin={() => setShowSignin(true)}
        ShowDonors={() => setShowDonors(true)}
        showPatients={() => setShowPatients(true)}
        openSignup={() => setShowRegister(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Auth Modal */}
      {(showSignin || showRegister) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AuthWrapper
            defaultForm={showRegister ? "register" : "login"}
            onLoginSuccess={onLoginSuccess}
            onClose={() => {
              setShowSignin(false);
              setShowRegister(false);
            }}
          />
        </div>
      )}

      {showDonors && <Content4 onClose={() => setShowDonors(false)} />}
      {showPatients && <Patient onClose={() => setShowPatients(false)} />}

      <div id="home"><Content /></div>
      <div id="content3"><Content3 A={() => setShowRegister(true)} /></div>
      <div id="about"><About /></div>
      <div id="contact"><Contact /></div>
      <Footer />
    </div>
  );
}

export default App;
