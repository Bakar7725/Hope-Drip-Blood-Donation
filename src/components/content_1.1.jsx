import React from 'react';
import { Shield, Droplet, Users, HeartHandshake } from 'lucide-react';

const FeatureCard = ({ Icon, title, description, color }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-[1.02]">
    <div className={`p-4 rounded-full mb-4 text-white ${color}`}>
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// ... (Imports and FeatureCard component remain the same)

const AfterScrollContent = () => {
  return (
    // ADJUSTMENT: Changed background to dark blue (#1f2937) and text colors to white/light gray
    <div className="bg-[#1f2937] min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <p className="text-red-400 font-semibold uppercase tracking-wider">Our Mission</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl"> 
            Why Every Drop Counts
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto"> // Adjusted text color
            We connect compassionate donors with patients in urgent need, ensuring a sustainable supply of life-saving blood components.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature Cards remain white for contrast */}
          <FeatureCard Icon={Droplet} title="Essential Supply" description="Maintaining a stable and accessible inventory of all blood types for emergencies and scheduled procedures." color="bg-red-500" />
          <FeatureCard Icon={Users} title="Community Focus" description="Building a strong, supportive network of regular donors and volunteers dedicated to giving back." color="bg-teal-500" />
          <FeatureCard Icon={Shield} title="Donor Safety" description="Ensuring a professional, clean, and comfortable experience for every donor through rigorous standards." color="bg-indigo-500" />
          <FeatureCard Icon={HeartHandshake} title="Patient Care" description="Directly supporting hospitals and healthcare facilities to save lives without delay or supply shortage." color="bg-green-500" />

        </div>
        
        {/* Call to Action at the Bottom of the Section */}
        <div className="mt-16 text-center">
            <a 
                href="/register" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 hover:"
            >
                Start Your Donor Journey
            </a>
            <p className="mt-4 text-sm text-gray-400"> // Adjusted text color
                It only takes 30 minutes to make a lifetime difference.
            </p>
        </div>

      </div>
    </div>
  );
};

export default AfterScrollContent;