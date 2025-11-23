import logo from "./images/1.png";
import './style/Navbar.css';
import background from './images/Navbar_background.png';

function smoothScroll(event, elementId) {
  event.preventDefault();
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function Navbar({ onShowSignin, ShowDonors , showPatients , openSignup }) {
  return (
    <div>
      <header style={{ backgroundImage: `url(${background})` }}
              className="flex items-center justify-between px-4 md:px-10 py-3">
        
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
          <h3 className="text-white text-xl font-telma">Hope Drip</h3>
        </div>

        {/* CENTER: Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-10 items-center text-white">
          <a href="#home" onClick={(e) => smoothScroll(e, 'home')} className="hover:text-gray-300 transition-colors">Home</a>
          <a href="#donors" onClick={(e) => { e.preventDefault(); ShowDonors(); }} className="hover:text-gray-300 transition-colors">Donors</a>
          <a href="#patient" onClick={(e) => { e.preventDefault(); showPatients(); }} className="hover:text-gray-300 transition-colors">Patient</a>
          <a href="#contact" onClick={(e) => smoothScroll(e, 'contact')} className="hover:text-gray-300 transition-colors">Contact</a>
          <a href="#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:text-gray-300 transition-colors">About</a>
        </nav>

        {/* RIGHT: Buttons */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          <button 
            className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
            onClick={onShowSignin}
          >
            SIGN IN
          </button>
          <button 
            className="bg-transparent text-white h-10 px-4 lg:px-5 rounded-md border transition-colors duration-300 hover:bg-[#3B341F] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] text-sm lg:text-base" 
          onClick={openSignup} >
            Register
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white text-2xl">☰</button>
      </header>
    </div>
  );
}

export default Navbar;
