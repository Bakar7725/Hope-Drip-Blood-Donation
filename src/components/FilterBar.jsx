import React from 'react';

// Import the Filter icon from lucide-react
// npm install lucide-react
import { Filter } from 'lucide-react';

const FilterBar = () => {
  return (
    // This wrapper places the bar against your site's dark background
    <div className="bg-[#242331] p-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto pt-10">
        
        {/* Input Box */}
        <input 
          type="text" 
          placeholder="Filter by city, blood group, or name..."
          className="
            flex-grow     /* This makes the input take up most of the space */
            bg-[#2C2B3C]       /* Dark input background */
            text-white
            border            /* Subtle border */
            border-gray-600
            rounded-lg
            py-2.5            /* Taller input field */
            px-4
            focus:outline-none
            focus:ring-2      /* Adds highlight ring on focus */
          "
        />
        
        {/* Filter Button */}
        <button 
          type="button"
          className="
            flex 
            items-center 
            justify-center
            gap-2
            bg-[#BFCFC4]      /* Your accent color */
            text-[#242331]    /* Dark text */
            font-bold
            py-2.5
            px-5
            rounded-lg
            transition-all
            duration-300
            hover:bg-opacity-80
            flex-shrink-0      /* Prevents button from shrinking */
          "
        >
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;