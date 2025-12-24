import React from 'react';
import bg from "./images/content1.2.jpg"
// FIX: Added the necessary icons (Droplet, HeartHandshake, Zap, CalendarDays, BarChart4)
// and removed the unused or invalid imports (RoundexFont, Users, HeartPulse, Building).
import { Droplet, HeartHandshake, Zap, CalendarDays, BarChart4, Hospital , ShieldUser } from 'lucide-react';

function Content1_2( {A} ) {
    return (
        <div className="min-h-screen flex flex-col justify-center"
            // 👇 ADDED: Inline style for the background image
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Optional: To make the content readable over the image
                 
                backgroundBlendMode: 'lighten' 
            }}
        >
            {/* Section Heading */}
            <div className="text-center mb-16 ">
                <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                    Find Your Path to Hope
                </h2>
                <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                    Whether you are giving life or seeking it, Hope Drip is here to support you every step of the way.
                </p>
            </div>

            {/* Donor and Patient Cards */}
            <div className="flex flex-row gap-20 pl-16">
                
                {/* DONOR CARD */}
                <div className="bg-black max-w-96 p-8 rounded-2xl shadow-2xl border-4 border-red-500 hover:shadow-red-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Droplet className="w-10 h-10 text-red-500" />
                        <h3 className="text-3xl font-bold text-red-500">Donate Blood</h3>
                    </div>
                    <p className="text-red-500 mb-6 flex justify-center">
                       <Hospital className="w-12 h-12 text-red-500" />
                    </p>
                    <ul className="space-y-3 text-gray-700 list-none pl-0">
                        <li className="flex items-start text-red-500">
                            <Zap className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Fast registration and the screening process.
                        </li>
                        <li className="flex items-start text-red-500">
                            <CalendarDays className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Easy scheduling at nearby centers.
                        </li>
                        <li className="flex items-start text-red-500">
                            <BarChart4 className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Track your impact over time.
                        </li>
                    
                        
                    </ul>
                    <a 
                        href="#" onClick={(e) => {
                            e.preventDefault(); // stops page reload
                            A();
                        }} 
                        className="mt-14     inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-md transition duration-300 transform hover:scale-[1.01]"
                    >
                        Register as a Donor
                    </a>
                </div>

                {/* PATIENT CARD */}
                <div className="bg-black p-8 max-w-96 rounded-2xl shadow-2xl border-4 border-teal-500 hover:shadow-teal-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <HeartHandshake className="w-10 h-10 text-teal-500" />
                        <h3 className="text-3xl font-bold text-teal-500">I Need Blood</h3>
                    </div>
                    <p className="text-teal-500 mb-6 flex justify-center">
                       <ShieldUser className="w-12 h-12 text-teal-500" />
                    </p>
                    <ul className="space-y-3 text-teal-500 list-none pl-0">
                        <li className="flex items-start text-teal-500">
                            <Zap className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            Urgent request submission for hospitals.
                        </li>
                        <li className="flex items-start text-teal-500">
                            <CalendarDays className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            Check real-time local blood availability.
                        </li>
                        <li className="flex items-start text-teal-500">
                            <BarChart4 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            Dedicated support for complex blood type needs.
                        </li>
                    </ul>
                    <a 
                        href="/find-blood" 
                        className="mt-8 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-md transition duration-300 transform hover:scale-[1.01]"
                    >
                        Submit a Request
                    </a>
                </div>

            </div>
        </div>
    );
}

export default Content1_2;