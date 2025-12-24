import React from 'react';
import { 
    Award, Droplet, Users, Clock, // Icons for StatCard
    Target, ShieldCheck, TrendingUp, Heart // Icons for ValueProp/Pillars & Callout
} from 'lucide-react';

// --- Component Definitions (Reused) ---
const StatCard = ({ Icon, number, label, colorClass }) => (
    // Dark Stat Card: bg-gray-800 with hover border
    <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg border-t-4 border-gray-700 hover:border-red-500 transition duration-300 hover:shadow-2xl">
        <Icon className={`w-10 h-10 mx-auto mb-3 ${colorClass}`} />
        <p className="text-4xl font-extrabold text-white">{number}</p>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);
// ------------------------------------

const AboutSection = () => {
    // Define the color scheme based on your existing design
    const PRIMARY_RED = 'text-red-600';
    const PRIMARY_TEAL = 'text-teal-400'; // Using a lighter teal for better contrast on dark background
    const BG_DARK = 'bg-[#0D1426]'; // Main Dark Background
    const TEXT_LIGHT = 'text-gray-100';
    const CARD_DARK = 'bg-[#0D1426]'; // Dark background for the new Pillar Cards

    return (
        <section className={`py-20 sm:py-24 ${BG_DARK}  `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Section Heading --- */}
                <div className="text-center mb-16">
                    <h2 className={`text-sm font-semibold uppercase tracking-wider ${PRIMARY_RED}`}>
                        Our Mission
                    </h2>
                    <p className={`mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl ${TEXT_LIGHT}`}>
                        Bridging Generosity with Urgent Need
                    </p>
                    <p className={`mt-4 text-xl max-w-3xl mx-auto ${TEXT_LIGHT} opacity-80`}>
                        Hope Drip connects willing donors with hospitals and patients, ensuring that no life is lost due to lack of blood supply.
                    </p>
                </div>
                
                {/* --- Impact Statistics Block --- */}
                <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard Icon={Droplet} number="15K+" label="Units Donated" colorClass={PRIMARY_RED} />
                    <StatCard Icon={Users} number="9,000" label="Lives Impacted" colorClass={PRIMARY_RED} />
                    <StatCard Icon={Clock} number="48 hrs" label="Average Delivery" colorClass={PRIMARY_RED} />
                    <StatCard Icon={Award} number="99.8%" label="Success Rate" colorClass={PRIMARY_RED} />
                </div>

                {/* --- MODIFIED: Three-Pillar Grid (Dark, Bordered Cards) --- */}
                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-10">
                        
                        {/* PILLAR 1: Seamless Access (Bordered Teal) */}
                        <div className={`p-8 rounded-xl ${CARD_DARK} border border-gray-700 shadow-2xl transition duration-300 transform hover:border-red-600 hover:shadow-red-600/10`}>
                            <dt>
                                <Target className={`w-10 h-10 mb-4 ${PRIMARY_TEAL}`} aria-hidden="true" />
                                <p className="text-2xl leading-7 font-bold text-white">
                                    Pillar 1: Seamless Access
                                </p>
                            </dt>
                            <dd className="mt-3 text-base text-gray-400">
                                We are committed to building the most efficient digital platform for blood procurement, making real-time availability and scheduling a reality for every hospital and donor.
                            </dd>
                        </div>

                        {/* PILLAR 2: Trust & Security (Bordered Red) */}
                        <div className={`p-8 rounded-xl ${CARD_DARK} border border-gray-700 shadow-2xl transition duration-300 transform hover:border-red-600 hover:shadow-red-600/10`}>
                            <dt>
                                <ShieldCheck className={`w-10 h-10 mb-4 ${PRIMARY_TEAL}`} aria-hidden="true" />
                                <p className="text-2xl leading-7 font-bold text-white">
                                    Pillar 2: Trust & Security
                                </p>
                            </dt>
                            <dd className="mt-3 text-base text-gray-400">
                                The donation process must be safe and transparent. We utilize secure, verified technology to protect all donor and patient data while ensuring the integrity of the blood supply chain.
                            </dd>
                        </div>

                        {/* PILLAR 3: Community Empowerment (Bordered Teal) */}
                        <div className={`p-8 rounded-xl ${CARD_DARK} border border-gray-700 shadow-2xl transition duration-300 transform hover:border-red-600 hover:shadow-red-600/10`}>
                            <dt>
                                <TrendingUp className={`w-10 h-10 mb-4 ${PRIMARY_TEAL}`} aria-hidden="true" />
                                <p className="text-2xl leading-7 font-bold text-white">
                                    Pillar 3: Community Empowerment
                                </p>
                            </dt>
                            <dd className="mt-3 text-base text-gray-400">
                                Our platform empowers local communities to solve their own shortages by facilitating direct connections and recognizing the vital contributions of every volunteer and organization.
                            </dd>
                        </div>
                    </dl>
                </div>

                

            </div>
        </section>
    );
}
export default AboutSection;