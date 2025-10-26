import './style/content_1.css';
import RoundexFont from './fonts/Roundex.otf';

function Content() {
  return (
    <div>
      <div className="bg-[#202030] hidden md:flex min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        {/* Responsive heading */}
        <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#C3DBC5] font-arial-custom text-center leading-tight'>
          GET STARTED WITH US
        </h1>
        {/* Responsive button container */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-8 sm:mt-10 md:mt-12' >
          <button className='bg-transparent text-white border-2 border-white px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-md hover:bg-[#3B341F] hover:text-[white] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] transition-colors duration-300 text-sm sm:text-base md:text-lg'>
            I'm Donor
          </button>
          <button className='bg-transparent text-white border-2 border-white px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-md hover:bg-[#3B341F] hover:text-[white] hover:shadow-[0_4px_12px_3px_rgba(0,0,0,0.8)] transition-colors duration-300 text-sm sm:text-base md:text-lg'>
            I'm Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default Content;