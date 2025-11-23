import './style/content_1.css';
import RoundexFont from './fonts/Roundex.otf';
import background from './images/background.png'
import { FaHandHoldingHeart , FaUserShield  } from "react-icons/fa6";
import { FaHandsHelping,FaWhatsappSquare,FaFacebook,FaTwitter } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

function Content() {
  return (
    <div>
      <div style={{ backgroundImage: `url(${background})` }}
       className="bg-cover bg-center md:flex min-h-[calc(100vh-64px)]   px-4 sm:px-6 lg:px-8">
        {/* Responsive heading */}
        <div className='relative top-[100px]'>
          <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-3xl  text-white font-arial-custom text-center leading-tight'>
          GET STARTED WITH US
        </h1>
        <span className='text-[#a7a5a5] relative left-5 top-3'>
          <p>&bull; Your blood is someone’s hope</p>
          <p>&bull; Give blood. Give life</p>
          <p>&bull; Small act. Big impact.</p>
        </span>
        </div>
        {/* <div className='flex flex-row gap-2 absolute bottom-6 left-[700px]'>
          <a href='#' className='text-2xl text-[#25D366]'><FaWhatsappSquare /></a>
          <a href='#' className='text-2xl text-[#0A65FE]'><FaFacebook /></a>
          <a href='#' className='text-2xl text-[#a7a5a5]'><FaTwitter /></a>
        </div> */}
        <div className='flex flex-row gap-2 absolute bottom-6 left-[700px]'>
          <h4 className='text-white text-3xl'><IoMdArrowDropdown /></h4>
        </div>
        <div className='flex flex-1 justify-end items-end pb-4 gap-6'>
          <h1 className='text-[#fcf4f4] text-3xl'><FaHandsHelping /></h1>
          <h1 className='text-[#fcf4f4] text-3xl'><FaUserShield /></h1>
          <h1 className='text-[#fcf4f4] text-3xl'><FaHandHoldingHeart /></h1>
        </div>
        
      </div>
    </div>
  );
}

export default Content;