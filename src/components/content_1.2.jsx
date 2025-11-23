import React from 'react';
// FIX: Added the necessary icons (Droplet, HeartHandshake, Zap, CalendarDays, BarChart4)
// and removed the unused or invalid imports (RoundexFont, Users, HeartPulse, Building).
import { Droplet, HeartHandshake, Zap, CalendarDays, BarChart4 } from 'lucide-react';

function Content1_2( {A} ) {
    return (
        <div className="min-h-screen flex flex-col justify-center">
            {/* Section Heading */}
            <div className="text-center mb-16 ">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Find Your Path to Hope
                </h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    Whether you are giving life or seeking it, Hope Drip is here to support you every step of the way.
                </p>
            </div>

            {/* Donor and Patient Cards */}
            <div className="flex flex-row justify-center gap-32">
                
                {/* DONOR CARD */}
                <div className="bg-white max-w-96 p-8 rounded-2xl shadow-2xl border-t-4 border-red-500 hover:shadow-red-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Droplet className="w-10 h-10 text-red-500" />
                        <h3 className="text-3xl font-bold text-gray-900">I Want to Donate</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Your selfless act provides immediate relief and long-term security for our communities. Join the movement and start saving lives today.
                    </p>
                    <ul className="space-y-3 text-gray-700 list-none pl-0">
                        <li className="flex items-start">
                            <Zap className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Fast registration & screening process.
                        </li>
                        <li className="flex items-start">
                            <CalendarDays className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Easy scheduling at nearby centers.
                        </li>
                        <li className="flex items-start">
                            <BarChart4 className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 mr-2" />
                            Track your impact over time.
                        </li>
                    </ul>
                    <a 
                        href="#" onClick={(e) => {
                            e.preventDefault(); // stops page reload
                            A();
                        }} 
                        className="mt-8 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-md transition duration-300 transform hover:scale-[1.01]"
                    >
                        Register as a Donor
                    </a>
                </div>

                {/* PATIENT CARD */}
                <div className="bg-white p-8 max-w-96 rounded-2xl shadow-2xl border-t-4 border-teal-500 hover:shadow-teal-300/50 transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <HeartHandshake className="w-10 h-10 text-teal-500" />
                        <h3 className="text-3xl font-bold text-gray-900">I Need Blood</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        We understand the urgency. We partner directly with hospitals to ensure a rapid and reliable supply of required blood components.
                    </p>
                    <ul className="space-y-3 text-gray-700 list-none pl-0">
                        <li className="flex items-start">
                            <Zap className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            Urgent request submission for hospitals.
                        </li>
                        <li className="flex items-start">
                            <CalendarDays className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1 mr-2" />
                            Check real-time local blood availability.
                        </li>
                        <li className="flex items-start">
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