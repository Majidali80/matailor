"use client";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "../../context/cartContext";
import Search from "../Search/page";

export default function Navbar() {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Menu items derived from the schema's 'category' field
  const menuItems = [
    { name: "Ready-to-Wear", href: "/shop?category=ready_to_wear" },
    { name: "Unstitched", href: "/shop?category=unstitched" },
    { name: "Custom-Stitched", href: "/shop?category=custom_stitched" },
  ];

  return (
    <nav className="bg-navyBlue text-softWhite shadow-lg w-full fixed top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-darkOrange rounded-full flex items-center justify-center">
              {/* Placeholder Logo - Replace with your actual logo */}
              <span className="text-ivoryWhite font-Montserrat font-extrabold text-xl">MA</span>
            </div>
            <span className="text-2xl font-Montserrat font-extrabold">
              <span className="text-darkOrange">MA</span> Fashion
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                >
                  Shop
                </Link>
              </li>
              <li className="relative group">
                <button className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200">
                  Categories
                </button>
                <ul className="absolute hidden group-hover:block bg-charcoal rounded-lg shadow-xl mt-2 p-3 w-48 transform -translate-x-1/4">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-softWhite hover:bg-navyBlue hover:text-darkYellow rounded-md transition-colors duration-200"
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
                  className="text-darkOrange hover:text-darkYellow font-Montserrat text-sm font-semibold transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Search />
              <Link href="/wishlist" aria-label="Wishlist" className="relative">
                <HiOutlineHeart className="w-6 h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Search />
            <button
              onClick={toggleMenu}
              className="text-darkOrange hover:text-darkYellow focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col items-center space-y-4 bg-charcoal rounded-b-lg">
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
            <div className="flex space-x-6">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                onClick={toggleMenu}
                className="relative"
              >
                <HiOutlineHeart className="w-6 h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
              </Link>
              <Link href="/cart" className="relative" aria-label="Cart" onClick={toggleMenu}>
                <HiOutlineShoppingBag className="w-6 h-6 text-darkOrange hover:text-darkYellow transition-colors duration-200" />
                {totalItemsInCart > 0 && (
                  <span className="absolute -top-2 -right-2 bg-darkYellow text-ivoryWhite text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}