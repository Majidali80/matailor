"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa"; // Import social media icons

export default function Footer() {
  const handleError = () => {
    console.error("Error loading logo image");
  };

  return (
    <footer className="bg-navy-900 text-white w-full z-20">
      {/* Main Content */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
          {/* Left Section: Logo & Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-3 sm:mb-4">
              <Image
                src="/logo.jpeg" // Placeholder; replace with your logo
                alt="MA Foods Logo"
                width={50}
                height={50}
                className="mr-2 sm:mr-3"
                onError={handleError} // Debug logo loading
              />
              <h1 className="text-amber-400 text-lg sm:text-xl font-bold font-Montserrat tracking-tight">
                MA Foods
              </h1>
            </div>
            <p className="text-navy-200 text-xs sm:text-sm max-w-[200px] sm:max-w-[250px]">
              Frozen meals crafted for convenience and taste.
            </p>
            <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 hover:text-amber-300 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 hover:text-amber-300 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 hover:text-amber-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Middle Section: Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
            {/* Company Info */}
            <div>
              <h2 className="text-amber-400 text-sm sm:text-base font-semibold font-Montserrat mb-2 sm:mb-3">Company</h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/about" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  About
                </Link>
                <Link href="/careers" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Careers
                </Link>
                <Link href="/contact" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Meals */}
            <div>
              <h2 className="text-amber-400 text-sm sm:text-base font-semibold font-Montserrat mb-2 sm:mb-3">Our Meals</h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/shop/beef" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Beef
                </Link>
                <Link href="/shop/pizza" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Pizza
                </Link>
                <Link href="/shop/momos" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Momos
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-amber-400 text-sm sm:text-base font-semibold font-Montserrat mb-2 sm:mb-3">Resources</h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/app" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  App
                </Link>
                <Link href="/faq" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  FAQ
                </Link>
                <Link href="/reviews" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Reviews
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h2 className="text-amber-400 text-sm sm:text-base font-semibold font-Montserrat mb-2 sm:mb-3">Legal</h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/terms" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Privacy
                </Link>
                <Link href="/returns" className="text-navy-200 hover:text-amber-300 text-xs font-medium transition-colors">
                  Returns
                </Link>
              </nav>
            </div>
          </div>

          {/* Right Section: Newsletter */}
          <div className="w-full md:w-auto">
            <h2 className="text-amber-400 text-sm sm:text-base font-semibold font-Montserrat mb-2 sm:mb-3">Stay Updated</h2>
            <div className="relative">
              <input
                type="email"
                className="w-full sm:w-56 md:w-64 h-9 sm:h-10 px-3 sm:px-4 border border-navy-600 rounded-full bg-navy-800 text-amber-200 placeholder-navy-300 text-xs sm:text-sm font-normal focus:outline-none focus:border-amber-400"
                placeholder="Your Email"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 sm:h-8 px-3 sm:px-4 bg-myDgold hover:bg-myLgold text-navy-900 text-xs font-semibold rounded-full transition-colors">
                Join
              </button>
            </div>
            <p className="text-navy-200 text-xs mt-2">Latest frozen delights.</p>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="bg-navy-800 py-3 sm:py-4 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-navy-700">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center text-navy-200 text-xs">
          <p>© {new Date().getFullYear()} MA Foods. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">
            Crafted by{" "}
            <a href="https://www.linkedin.com/in/majid-ali-b44661230/" className="text-amber-400 hover:text-amber-300">
              Majid Ali
            </a>
          </p>
        </div>
      </section>
    </footer>
  );
}