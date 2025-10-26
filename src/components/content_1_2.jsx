import React from 'react';

// For the icons, we'll continue using lucide-react.
// npm install lucide-react
import { Users, HeartPulse, Building } from 'lucide-react';

// Data for the stats. This makes it easy to update the numbers.
const statsData = [
  {
    icon: <Users size={48} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    number: "10,000+",
    label: "Donors Registered"
  },
  {
    icon: <HeartPulse size={48} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    number: "5,000+",
    label: "Lives Impacted"
  },
  {
    icon: <Building size={48} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    number: "50+",
    label: "Partner Hospitals"
  }
];

const ImpactSection = () => {
  return (
    // Section container with the main dark background
    <section className="bg-[#202030]  py-20 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]  flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">

        {/* Section Title */}
        <h2 
          className="
            text-4xl 
            lg:text-5xl 
            font-extrabold 
            text-center 
            text-[#BFCFC4]    /* Your accent color */
            mb-16             /* Space below the title */
            uppercase
            tracking-wide
          "
        >
          Our Impact
        </h2>

        {/* Grid container for the stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Map over the statsData array to create each stat item */}
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="
                flex 
                flex-col 
                items-center 
                text-center
              "
            >
              {/* Icon */}
              <div className="mb-4">
                {stat.icon}
              </div>
              
              {/* Large Number */}
              <span className="
                text-6xl 
                lg:text-7xl 
                font-extrabold 
                text-[#BFCFC4] /* Accent color */
              ">
                {stat.number}
              </span>
              
              {/* Label */}
              <span className="
                text-xl 
                font-medium 
                text-white 
                mt-4
              ">
                {stat.label}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default ImpactSection;