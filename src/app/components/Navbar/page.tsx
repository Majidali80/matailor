"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "../../context/cartContext";
import Search from "../Search/page";
import Image from "next/image";

export default function Navbar() {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev); // Toggle menu state

  // Menu items derived from the schema's 'category' field
  const menuItems = [
    { name: "Ready-to-Wear", href: "/shop?category=ready_to_wear" },
    { name: "Unstitched", href: "/shop?category=unstitched" },
    { name: "Custom-Stitched", href: "/shop?category=custom_stitched" },
  ];

  // Load wishlist count from localStorage and sync with updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      const wishlistSet = storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
      setWishlistCount(wishlistSet.size);

      const updateWishlistCount = () => {
        const updatedWishlist = localStorage.getItem("wishlist");
        const updatedSet = updatedWishlist ? new Set<string>(JSON.parse(updatedWishlist)) : new Set<string>();
        setWishlistCount(updatedSet.size);
      };

      window.addEventListener("wishlistUpdated", updateWishlistCount);
      return () => window.removeEventListener("wishlistUpdated", updateWishlistCount);
    }
  }, []);

  return (
    <nav className="bg-darkPurple text-softWhite shadow-lg w-full fixed top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Section (Hamburger/Search on Mobile, Hidden on sm/md) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-darkOrange hover:text-darkYellow focus:outline-none transition-colors duration-200 mr-3"
              aria-label="Toggle menu"
            >
              <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
            <Search />
          </div>

          {/* Center Logo (sm, md, tablet) */}
          <div className="hidden sm:flex sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 md:flex md:absolute md:left-1/2 md:-translate-x-1/2 lg:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-darkOrange rounded-full flex items-center justify-center">
                <Image
                  src="/logo2.png" // Updated logo path
                  alt="MA Tailor Logo"
                  width={110}
                  height={110}
                  className="rounded-full"
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-Montserrat font-extrabold">
                <span className="text-darkOrange">MA</span> Tailor
              </span>
            </Link>
          </div>

          {/* Left Logo (Base and lg) */}
          <div className="flex sm:hidden lg:flex">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-darkOrange rounded-full flex items-center justify-center">
                <Image
                  src="/logo2.png" // Updated logo path
                  alt="MA Tailor Logo"
                  width={110}
                  height={110}
                  className="rounded-full"
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-Montserrat font-extrabold">
                <span className="text-darkOrange">MA</span> Tailor
              </span>
            </Link>
          </div>

          {/* Desktop Menu (lg and up) */}
          <div className="hidden lg:flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-base font-semibold transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-base font-semibold transition-colors duration-200"
                >
                  Shop
                </Link>
              </li>
              <li className="relative group">
                <button className="text-darkOrange hover:text-darkYellow font-Montserrat text-base font-semibold transition-colors duration-200">
                  Categories
                </button>
                <ul className="absolute hidden group-hover:block bg-charcoal rounded-lg shadow-xl mt-2 p-3 w-48 transform -translate-x-1/4">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-softWhite hover:bg-darkPurple hover:text-darkYellow rounded-md transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-base font-semibold transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Search />
              <Link href="/wishlist" className="relative" aria-label="Wishlist">
                <HiOutlineHeart className="w-6 h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-darkYellow text-ivoryWhite text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative" aria-label="Cart">
                <HiOutlineShoppingBag className="w-6 h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
                {totalItemsInCart > 0 && (
                  <span className="absolute -top-2 -right-2 bg-darkYellow text-ivoryWhite text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Right Section (Icons on Mobile, Hidden on lg) */}
          <div className="flex items-center space-x-3 md:hidden lg:hidden">
            <Link href="/wishlist" className="relative" aria-label="Wishlist">
              <HiOutlineHeart className="w-5 sm:w-6 h-5 sm:h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-darkYellow text-ivoryWhite text-[10px] sm:text-xs font-bold rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative" aria-label="Cart">
              <HiOutlineShoppingBag className="w-5 sm:w-6 h-5 sm:h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-darkYellow text-ivoryWhite text-[10px] sm:text-xs font-bold rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 py-3 sm:py-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col items-center space-y-3 sm:space-y-4 bg-charcoal rounded-b-lg">
            <li>
              <Link
                href="/"
                className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Shop
              </Link>
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Cart {totalItemsInCart > 0 ? `(${totalItemsInCart})` : ""}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}