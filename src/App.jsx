import { useState } from 'react';
import Navbar from './components/Navbar';
import Content1 from './components/content_1';
import SigninModal from './components/Signin';
import Content from './components/content_1'; 
import Content2 from './components/content_1.1';
import Content3 from './components/content_1.2';
import Content4 from './components/content_1.3';
import Signin from './components/signin';
import DonorPatient from './components/DonorPatient';
import Patient from './components/Patients';
import Contact from './components/Contact';
import About from './components/About';
import SignupModal from './components/Signup';
import Content1_1 from './components/content_1_1';
import Content1_2 from './components/content_1_2';
import Patient_view from './components/Patient_view';

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDonors, setShowDOnors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);

  function ShowSigninForm() {
    setShowSignin(true);
    setShowSignup(false);
  }

  function hideSigninForm() {
    setShowSignin(false);
  }

  function C() {
    setShowRegister(true);
  }

  function D() {
    setShowRegister(false);
  }

  function onShowDonors() {
    setShowDOnors(true);
  }

  function onHideDonors() {
    setShowDOnors(false);
  }

  function onShowPatients() {
    setShowPatients(true);
  }

  function onHidePatients() {
    setShowPatients(false);
  }

  return (
    <div>
      <Navbar 
        onShowSignin={ShowSigninForm}
        onShowSignup={() => { setShowSignup(true); setShowSignin(false); }}
        ShowDonors={onShowDonors}
        showPatients={onShowPatients}
        openSignup={() => setShowSignup(true)}
      />

      {/* Show SigninModal when showSignin is true */}
      {showSignin && <SigninModal onClose={() => setShowSignin(false)} />}
      {showSignup && (
        <SignupModal 
          onClose={() => setShowSignup(false)} 
          onShowSignin={() => {
            setShowSignin(true);
            setShowSignup(false);
          }}
        />
      )}

      {/* Your other content */}
      <Content1 />
      <Content1_1 />
      <Content1_2 />
      <section id="donors-section">
        <Patient_view />
      </section>

      {/* Modals */}
      {showDonors && <Content4 onClose={() => setShowDOnors(false)} />}
      {showPatients && <Patient onClose={() => setShowPatients(false)} />}
      
      {/* Page Sections */}
      <div id="home"><Content /></div>
      <div id="content2"><Content2 /></div>
      <div id="content3">
        <Content3 A={C} />
        {showRegister && <DonorPatient B={D} />}
      </div>
      <div id="contact"><Contact /></div>
      <div id="about"><About /></div>
    </div>
  );
}

export default App;
