// App.js
import { useState } from 'react';
import Navbar from './components/Navbar';
import Content1 from './components/content_1'
import SigninModal from './components/Signin';
import SignupModal from './components/Signup';
import Content1_1 from './components/content_1_1';
import Content1_2 from './components/content_1_2';
import Patient_view from './components/Patient_view';

function App() {
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      <Navbar 
        onShowSignin={() => {
          setShowSignin(true);
          setShowSignup(false);
        }}
        onShowSignup={() => {
          setShowSignup(true);
          setShowSignin(false);
        }}
      />

      
      {/* Show SigninModal when showSignin is true */}
      {showSignin && (
        <SigninModal onClose={() => setShowSignin(false)} />
      )}
      {showSignup && (
       <SignupModal onClose={() => {
          setShowSignup(false);
        }} onShowSignin ={()=>
        {
          setShowSignin(true)
          setShowSignup(false)
        }
        } />

      )}
      
      {/* Your other content */}
      <div>
        {/* Your content here */}
        <Content1 />
        <Content1_1 />
        <Content1_2 />
        <section id="donors-section">
        <Patient_view />
      </section>
      </div>
    </div>
  );
}

export default App;