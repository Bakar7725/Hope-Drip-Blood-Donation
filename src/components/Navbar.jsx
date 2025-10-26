// Navbar.jsx
import logo from "./images/1.png";
import './style/Navbar.css'

function smoothScroll(event, elementId) {
  event.preventDefault();
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function Navbar({ onShowSignin, onShowSignup }) {
  return (
    <div>
      <header className="bg-[#230e11] flex items-center justify-between px-4 md:px-10 py-3">
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
          <h3 className="text-white text-xl font-telma">Hope Drip</h3>
        </div>

        {/* CENTER: Navigation links - Hidden on mobile, visible on medium+ screens */}
        <nav className="hidden md:flex gap-6 lg:gap-10 items-center text-white">
          <a href="#" className="hover:text-gray-300 transition-colors">Home</a>
          <a href="#" onClick={(event) => smoothScroll(event, 'donors-section')} className="hover:text-gray-300 transition-colors">Donors</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Patient</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          <a href="#" className="hover:text-gray-300 transition-colors">About</a>
        </nav>

        {/* RIGHT: Buttons - Hidden on mobile, visible on medium+ screens */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          <button 
            className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
            onClick={onShowSignin}
          >
            SIGN IN
          </button>
          <button 
            className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
            onClick={onShowSignup}
          >
            Register
          </button>
        </div>

        {/* Mobile menu button (optional hamburger menu) */}
        <button className="md:hidden text-white text-2xl">
          ☰
        </button>
      </header>
    </div>
  );
}

export default Navbar;