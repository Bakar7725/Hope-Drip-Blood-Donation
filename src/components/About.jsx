import React from 'react';
import { Leaf, Award, Heart, TrendingUp, Droplet, Users, Clock } from 'lucide-react';

// Placeholder URL for a relevant image (e.g., people donating, lab work, community support)
const ABOUT_IMAGE_URL = 'https://placehold.co/600x400/1D4ED8/white?text=Professional+Service';

const StatCard = ({ Icon, number, label, colorClass }) => (
    // Card background changed to a dark gray: bg-gray-800
    <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg border-t-4 border-gray-700 hover:border-cyan-500 transition duration-300 hover:shadow-2xl">
        <Icon className={`w-10 h-10 mx-auto mb-3 ${colorClass}`} />
        <p className="text-4xl font-extrabold text-white">{number}</p>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

const ValueProp = ({ Icon, title, description, colorClass }) => (
    <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 p-3 rounded-full ${colorClass} text-white shadow-lg`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-gray-400">{description}</p>
        </div>
    </div>
);

const AboutSection = () => {
    // Main background changed to deep gray: bg-gray-900
    return (
        <div className="bg-gray-900 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. Header and Subtitle */}
                <div className="text-center mb-16">
                    <p className="text-blue-400 font-semibold uppercase tracking-wider">Our Story & Mission</p>
                    <h2 className="mt-2 text-5xl font-extrabold text-white">
                        A Commitment to Trust and Excellence
                    </h2>
                </div>

                {/* 2. Main Content Grid (Text + Image) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column: Text and Values */}
                    <div className="space-y-6">
                        <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-cyan-500 pl-4 italic">
                            "Founded on the principle of transparency and robust support, we provide essential services for health and community infrastructure."
                        </p>
                        <p className="text-lg text-gray-400">
                            We operate a comprehensive, real-time platform that streamlines critical logistics and operational processes. Our focus is on maximizing efficiency, maintaining the highest security standards, and fostering a culture of continuous support for our clients.
                        </p>
                        
                        {/* Core Values */}
                        <div className="mt-8 space-y-6 pt-4">
                            <ValueProp 
                                Icon={Heart} 
                                title="Customer Centricity" 
                                description="Putting the needs of our users and clients at the heart of every technological solution we deploy."
                                colorClass="bg-cyan-500"
                            />
                            <ValueProp 
                                Icon={Award} 
                                title="Data Security" 
                                description="Adhering to strict international guidelines for data privacy, compliance, and systems security."
                                colorClass="bg-blue-600"
                            />
                            <ValueProp 
                                Icon={TrendingUp} 
                                title="Scalable Technology" 
                                description="Utilizing modern cloud architecture to minimize latency and optimize system responsiveness globally."
                                colorClass="bg-green-500"
                            />
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="shadow-2xl rounded-2xl overflow-hidden transform transition duration-500 hover:scale-[1.01] border border-gray-700">
                        <img 
                            src={ABOUT_IMAGE_URL} 
                            alt="A scene depicting community support and urgent care" 
                            className="w-full h-auto object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/374151/white?text=About+Us+Image' }}
                        />
                    </div>
                </div>

                {/* 3. Impact Stats Section */}
                

            </div>
        </div>
    );
};

export default AboutSection;