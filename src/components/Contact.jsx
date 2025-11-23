import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Contact Info Card Component
const InfoCard = ({ Icon, title, content, detail, color }) => (
    // Card background changed to a slightly darker gray: bg-gray-800
    <div className="flex flex-col items-start p-6 bg-gray-800 rounded-xl shadow-lg border-t-4 border-gray-700 hover:border-cyan-500 transition duration-300 transform hover:scale-[1.02]">
        <div className={`p-3 rounded-full mb-4 text-white ${color}`}>
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-300">{content}</p>
        <p className="text-sm text-cyan-400 mt-2 font-semibold">{detail}</p>
    </div>
);

const ContactSection = () => {
    // Simple state management for the form (non-functional submission)
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to an API endpoint.
        // For this example, we'll just log it.
        console.log('Form Submitted:', formData);
        alert('Thank you for your message! We will be in touch shortly.');
        setFormData({ name: '', email: '', message: '' }); // Clear form
    };

    // Main background changed to deep gray: bg-gray-900
    return (
        <div className="bg-gray-900 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-cyan-400 font-semibold uppercase tracking-wider">Get In Touch</p>
                    <h2 className="mt-2 text-5xl font-extrabold text-white">
                        Contact Our Support Team
                    </h2>
                    <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
                        We're here to help! Send us a message or reach out using the contact information below.
                    </p>
                </div>

                {/* Content Grid: Info Cards and Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* 1. Contact Info Cards (Left Column - Spanning 1/3) */}
                    <div className="space-y-6 lg:col-span-1">
                        <InfoCard 
                            Icon={Mail} 
                            title="Email Us" 
                            content="Our dedicated support team is available 24/7." 
                            detail="support@techsolution.com"
                            color="bg-cyan-600"
                        />
                        <InfoCard 
                            Icon={Phone} 
                            title="Call Us" 
                            content="For urgent inquiries, please contact us directly." 
                            detail="+1 (555) 123-4567"
                            color="bg-blue-600"
                        />
                        <InfoCard 
                            Icon={MapPin} 
                            title="Office Location" 
                            content="Visit our global headquarters in Silicon Valley." 
                            detail="100 Tech Drive, San Jose, CA 95110"
                            color="bg-indigo-600"
                        />
                    </div>

                    {/* 2. Contact Form (Right Column - Spanning 2/3) */}
                    {/* Form background changed to dark gray: bg-gray-800 */}
                    <div className="lg:col-span-2 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                        <h3 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">Send a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    // Input styling for dark theme
                                    className="block w-full rounded-lg border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 p-3 shadow-inner"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    // Input styling for dark theme
                                    className="block w-full rounded-lg border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 p-3 shadow-inner"
                                    placeholder="you@company.com"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    // Textarea styling for dark theme
                                    className="block w-full rounded-lg border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 p-3 shadow-inner resize-none"
                                    placeholder="How can we assist you today?"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 shadow-xl transition duration-300 transform hover:scale-[1.005]"
                            >
                                <Send className="w-5 h-5 mr-3" />
                                Send Inquiry
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactSection;