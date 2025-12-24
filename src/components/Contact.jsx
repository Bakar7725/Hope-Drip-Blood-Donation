import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Droplet,
} from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#282A36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl">
            Connect with Hope Drip
          </p>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-gray-300">
            Have questions about donating, requesting blood, or partnerships?
            We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT COLUMN */}
          <div className="space-y-10 lg:col-span-1">

            {/* CONTACT INFO */}
            <div className="p-8 rounded-xl bg-[#1A1F2E] border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-red-500">
                Direct Contact
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-teal-400" />
                  <span className="text-gray-300">
                    info@hopedrip.org
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-teal-400" />
                  <span className="text-gray-300">
                    (555) 123-4567
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-teal-400 mt-1" />
                  <span className="text-gray-300">
                    100 Donor St, Life City, 90210
                  </span>
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="p-8 rounded-xl bg-[#1A1F2E] border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-red-500">
                Follow Our Journey
              </h3>

              <div className="flex space-x-6">
                <a className="text-gray-400 hover:text-red-500 transition">
                  <Facebook size={28} />
                </a>
                <a className="text-gray-400 hover:text-red-500 transition">
                  <Twitter size={28} />
                </a>
                <a className="text-gray-400 hover:text-red-500 transition">
                  <Linkedin size={28} />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - FORM */}
          <div className="lg:col-span-2">
            <div className="p-10 rounded-xl bg-[#1A1F2E] border-t-4 border-red-600 shadow-2xl">
              <h3 className="text-3xl font-bold mb-8 text-gray-100">
                Send a Message
              </h3>

              <form className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAME */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 w-full rounded-md bg-[#1F2333] text-gray-100 border border-gray-600 placeholder-gray-400 py-3 px-4 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 hover:border-gray-500"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 w-full rounded-md bg-[#1F2333] text-gray-100 border border-gray-600 placeholder-gray-400 py-3 px-4 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 hover:border-gray-500"
                    />
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <select className="mt-1 w-full rounded-md bg-[#1F2333] text-gray-100 border border-gray-600 py-3 px-4 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 hover:border-gray-500">
                    <option>Donation Inquiry</option>
                    <option>Blood Request</option>
                    <option>Partnership</option>
                    <option>General Question</option>
                  </select>
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    How can we help?
                  </label>
                  <textarea
                    rows="4"
                    required
                    className="mt-1 w-full rounded-md bg-[#1F2333] text-gray-100 border border-gray-600 py-3 px-4 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 hover:border-gray-500"
                  ></textarea>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 text-base font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 shadow-lg transition duration-300 transform hover:scale-[1.02]"
                >
                  <Droplet className="w-5 h-5 mr-2" />
                  Send Your Message
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
