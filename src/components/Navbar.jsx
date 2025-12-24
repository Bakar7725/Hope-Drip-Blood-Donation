import logo from "./images/1.png";
import './style/Navbar.css';
import background from './images/Navbar_background.png';
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

function smoothScroll(event, elementId) {
  event.preventDefault();
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function Navbar({ onShowSignin, ShowDonors, showPatients, openSignup, isLoggedIn, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuItemClick = (action) => {
    setShowDropdown(false);
    
    switch(action) {
      case 'personal-info':
        // Add your personal info handler here
        console.log("Personal Info clicked");
        break;
      case 'change-password':
        // Add your change password handler here
        console.log("Change Password clicked");
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <header 
        style={{ backgroundImage: `url(${background})` }}
        className="flex items-center justify-between px-4 md:px-3 py-3 relative"
      >
        
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
          <h3 className="text-white text-xl font-telma">Hope Drip</h3>
        </div>

        {/* CENTER: Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-10 items-center text-white">
          <a href="#home" onClick={(e) => smoothScroll(e, 'home')} className="hover:text-gray-300 transition-colors after:duration-500 hover:after:w-full">Home</a>
          <a href="#donors" onClick={(e) => { e.preventDefault(); ShowDonors(); }} className="hover:text-gray-300 transition-colors">Donors</a>
          <a href="#patient" onClick={(e) => { e.preventDefault(); showPatients(); }} className="hover:text-gray-300 transition-colors">Patient</a>
          <a href="#contact" onClick={(e) => smoothScroll(e, 'contact')} className="hover:text-gray-300 transition-colors">Contact</a>
          <a href="#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-gray-300 transition-colors">About</a>
        </nav>

        {/* RIGHT: Buttons - Conditional Rendering */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5 relative" ref={dropdownRef}>
          {!isLoggedIn ? (
            // ✅ Not logged in - Show Sign In and Register
            <>
              <button 
                className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
                onClick={onShowSignin}
              >
                SIGN IN
              </button>
              <button 
                className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
                onClick={openSignup}
              >
                Register
              </button>
            </>
          ) : (
            // ✅ Logged in - Show User Icon with Dropdown
            <>
              <button 
                className="bg-transparent text-white rounded-md text-sm lg:text-base hover:bg-transparent transition-transform duration-200 hover:scale-110" 
                onClick={toggleDropdown}
              >
                <h1 className='text-3xl'><FaUserCircle /></h1>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleMenuItemClick('personal-info')}
                  >
                    Personal Info
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleMenuItemClick('change-password')}
                  >
                    Change Password
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleMenuItemClick('change-password')}
                  >
                    Verification Required
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleMenuItemClick('logout')}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white text-2xl">☰</button>
      </header>
    </div>
  );
}

export default Navbar;