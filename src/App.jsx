import { useState } from 'react';
import Navbar from './components/Navbar';
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

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // single source of truth
  const [showDonors, setShowDOnors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);

  function ShowSigninForm() {
    setShowSignin(true);
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

const [showSignup, setShowSignup] = useState(false);

function openSignup() {
  setShowSignup(true);
}

function closeSignup() {
  setShowSignup(false);
}

  return (
    <div>
      <Navbar 
        onShowSignin={ShowSigninForm}
        ShowDonors={onShowDonors}
        showPatients={onShowPatients}
        openSignup={openSignup}
      />

      {/* Modals */}
      {showSignin && <Signin onClose={hideSigninForm} />}
      {showDonors && <Content4 onClose={onHideDonors} />}
      {showPatients && <Patient onClose={onHidePatients} />}
      {showSignup && <SignupModal onClose={closeSignup} onShowSignin={ShowSigninForm} />}

      {/* Page Sections */}
      <div id="home"><Content /></div>
      <div id="content2"><Content2 /></div>
      <div id="content3">
        <Content3 A={C} />
        {showRegister && <DonorPatient B={D} />}
      </div>
      <div id="contact"><Contact /></div>
      <div id="about"><About /></div>
      {/* Removed duplicated <Patient /> from here */}
    </div>
  );
}

export default App;
