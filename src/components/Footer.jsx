import React from "react";
import {
  Droplet,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0D1426] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Droplet className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-extrabold text-red-500">
                Hope Drip
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hope Drip connects blood donors with those in need through
              technology, compassion, and urgency — saving lives every day.
            </p>
          </div>

          {/* OUR IMPACT */}
<div>
  <h3 className="text-lg font-semibold text-red-500 mb-4">
    Our Impact
  </h3>
  <ul className="space-y-3 text-sm text-gray-400">
    <li className="flex justify-between">
      <span>Lives Saved</span>
      <span className="text-red-500 font-semibold">12,450+</span>
    </li>
    <li className="flex justify-between">
      <span>Active Donors</span>
      <span className="text-red-500 font-semibold">8,200+</span>
    </li>
    <li className="flex justify-between">
      <span>Hospitals Partnered</span>
      <span className="text-red-500 font-semibold">145+</span>
    </li>
    <li className="flex justify-between">
      <span>Cities Covered</span>
      <span className="text-red-500 font-semibold">30+</span>
    </li>
  </ul>
</div>


          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500" />
                info@hopedrip.org
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500" />
                (555) 123-4567
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-1" />
                100 Donor St, Life City
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a className="p-2 rounded-full bg-[#1A1F2E] hover:bg-red-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a className="p-2 rounded-full bg-[#1A1F2E] hover:bg-red-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a className="p-2 rounded-full bg-[#1A1F2E] hover:bg-red-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a className="p-2 rounded-full bg-[#1A1F2E] hover:bg-red-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-red-500 font-semibold">
              Hope Drip
            </span>
            . All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-red-500 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-red-500 transition">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
