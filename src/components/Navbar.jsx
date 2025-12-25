import logo from "./images/1.png";
import background from './images/Navbar_background.png';
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

function Navbar({
  onShowSignin,
  ShowDonors,
  showPatients,
  openSignup,
  isLoggedIn,
  onLogout,
  closeOverlays
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleMenuItemClick = (action) => {
    setShowDropdown(false);
    if (action === "logout") onLogout();
  };

  // ✅ FIXED SCROLL (LOGIC ONLY)
  const handleScroll = (e, sectionId) => {
    e.preventDefault();

    if (closeOverlays) closeOverlays(); // 🔑 PAGE RESET

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
          onClick={(e) => {
            e.preventDefault();
            if (closeOverlays) closeOverlays();
            ShowDonors();
          }}
          className="hover:text-gray-300"
        >
          Donors
        </a>

        <a
          href="#patient"
          onClick={(e) => {
            e.preventDefault();
            if (closeOverlays) closeOverlays();
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

      <div className="hidden md:flex items-center gap-4 lg:gap-5 relative" ref={dropdownRef}>
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
            <button
              className="bg-transparent text-white rounded-md hover:scale-110 transition-transform duration-200"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-3xl" />
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Personal Info
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Change Password
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Verification Required
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
  );
}

export default Navbar;