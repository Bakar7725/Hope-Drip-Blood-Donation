import React from 'react';

// For the icons, we'll use lucide-react.
// You'll need to add it to your project by running:
// npm install lucide-react
// or
// yarn add lucide-react
import { UserPlus, UserSearch, Heart } from 'lucide-react';

// We can define the data for our steps in an array
// This makes the code cleaner and easier to update
const stepsData = [
  {
    // The icon from your image is a "user" with a "plus"
    icon: <UserPlus size={64} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    title: "1. Register",
    description: "Create your secure profile as donor or post a request as patient.",
  },
  {
    // This icon represents "matching" or "searching for a user"
    icon: <UserSearch size={64} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    title: "2. Get Matched",
    description: "Our smart system connects with compatible donors or urgent needs.",
  },
  {
    // The heart icon represents "Save a Life"
    icon: <Heart size={64} className="text-[#BFCFC4]" strokeWidth={1.5} />,
    title: "3. Save a Life",
    description: "Connect, coordinate the donation, and make a life-changing impact.",
  },
];

const HowItWorks = () => {
  return (
    // Section container with the main dark background
    <section className="
      bg-[#242331] 
      min-h-[calc(100vh-64px)] 
      py-20 
      px-4 
      sm:px-6 
      lg:px-8 
      flex            /* <-- ADDED */
      flex-col        /* <-- ADDED */
      justify-center  /* <-- ADDED (Vertical Centering) */
      items-center    /* <-- ADDED (Horizontal Centering) */
    ">
      <div className="max-w-6xl mx-auto w-full"> {/* <-- ADDED w-full */}
        
        {/* Section Title */}
        <h2 
          className="
            text-4xl 
            lg:text-5xl 
            font-extrabold 
            text-center 
            text-[#BFCFC4]
            mb-16
            uppercase
            tracking-wide
          "
        >
          A Simple Process to Save Lives
        </h2>

        {/* Grid container for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* We map over the stepsData array to create each card */}
          {stepsData.map((step, index) => (
            <div 
              key={index}
              className="
                bg-[#111112]
                rounded-lg 
                p-8 
                flex 
                flex-col 
                items-center 
                text-center
                shadow-xl
                transition-transform
                duration-300
                hover:-translate-y-2
              "
            >
              {/* Icon */}
              <div className="mb-6">
                {step.icon}
              </div>
              
              {/* Step Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {step.title}
              </h3>
              
              {/* Step Description */}
              <p className="text-gray-300 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;