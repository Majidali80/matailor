"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const handleError = () => {
    console.error("Error loading logo image");
  };

  return (
    <footer className="bg-darkPurple text-softWhite w-full z-20">
      {/* Main Content */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
          {/* Left Section: Logo & Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-3 sm:mb-4">
              <Image
                src="/logo2.png" // Updated logo path
                alt="MA Tailor Logo"
                width={90} // Adjusted for responsiveness
                height={90}
                className="mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
                onError={handleError}
              />
              <h1 className="text-darkOrange text-lg sm:text-xl md:text-2xl font-bold font-Montserrat tracking-tight">
                MA Tailor
              </h1>
            </div>
            <p className="text-ivoryWhite text-xs sm:text-sm max-w-[200px] sm:max-w-[250px]">
              Tailored fashion crafted with precision and style.
            </p>
            <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-darkOrange hover:text-darkYellow transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-darkOrange hover:text-darkYellow transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-darkOrange hover:text-darkYellow transition-colors" />
              </a>
            </div>
          </div>

          {/* Middle Section: Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Company Info */}
            <div>
              <h2 className="text-darkOrange text-sm sm:text-base md:text-lg font-semibold font-Montserrat mb-2 sm:mb-3">
                Company
              </h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/about" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/careers" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Careers
                </Link>
                <Link href="/contact" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Categories (Updated from Meals) */}
            <div>
              <h2 className="text-darkOrange text-sm sm:text-base md:text-lg font-semibold font-Montserrat mb-2 sm:mb-3">
                Categories
              </h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/shop?category=ready_to_wear" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Ready-to-Wear
                </Link>
                <Link href="/shop?category=unstitched" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Unstitched
                </Link>
                <Link href="/shop?category=custom_stitched" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Custom-Stitched
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-darkOrange text-sm sm:text-base md:text-lg font-semibold font-Montserrat mb-2 sm:mb-3">
                Resources
              </h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/app" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  App
                </Link>
                <Link href="/faq" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  FAQ
                </Link>
                <Link href="/reviews" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Reviews
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h2 className="text-darkOrange text-sm sm:text-base md:text-lg font-semibold font-Montserrat mb-2 sm:mb-3">
                Legal
              </h2>
              <nav className="flex flex-col gap-1 sm:gap-2">
                <Link href="/terms" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Privacy
                </Link>
                <Link href="/returns" className="text-ivoryWhite hover:text-darkYellow text-xs sm:text-sm font-medium transition-colors">
                  Returns
                </Link>
              </nav>
            </div>
          </div>

          {/* Right Section: Newsletter */}
          <div className="w-full sm:w-auto">
            <h2 className="text-darkOrange text-sm sm:text-base md:text-lg font-semibold font-Montserrat mb-2 sm:mb-3">
              Stay Updated
            </h2>
            <div className="relative">
              <input
                type="email"
                className="w-full sm:w-48 md:w-56 lg:w-64 h-8 sm:h-9 md:h-10 px-3 sm:px-4 border border-charcoal rounded-full bg-darkPurple text-ivoryWhite placeholder-ivoryWhite placeholder-opacity-50 text-xs sm:text-sm font-normal focus:outline-none focus:border-darkOrange"
                placeholder="Your Email"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 sm:h-7 md:h-8 px-2 sm:px-3 md:px-4 bg-darkOrange hover:bg-darkYellow text-ivoryWhite text-xs sm:text-sm font-semibold rounded-full transition-colors">
                Join
              </button>
            </div>
            <p className="text-ivoryWhite text-xs mt-2">Latest tailoring trends.</p>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="bg-charcoal py-3 sm:py-4 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-darkPurple">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center text-ivoryWhite text-xs">
          <p>© {new Date().getFullYear()} MA Tailor. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">
            Crafted by{" "}
            <a href="https://www.linkedin.com/in/majid-ali-b44661230/" className="text-darkOrange hover:text-darkYellow">
              Majid Ali
            </a>
          </p>
        </div>
      </section>
    </footer>
  );
}