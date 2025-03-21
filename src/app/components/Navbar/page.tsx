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

  const menuItems = [
    { name: "Amy's Kitchen Frozen Meals", href: "https://www.amys.com/our-foods" },
    { name: "Trader Joe's Frozen Entrees", href: "https://www.traderjoes.com/home/products/category/frozen" },
    { name: "Lean Cuisine", href: "https://www.leancuisine.com/products" },
    { name: "Evol Foods", href: "https://evolfoods.com/our-food" },
  ];

  return (
    <nav className="bg-navy-900 text-white shadow-md w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-extrabold font-Montserrat">
            <span className="text-amber-400">MA</span> <span className="text-white">Foods</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <ul className="flex space-x-4 lg:space-x-6">
              <li>
                <Link href="/" className="text-amber-300 hover:text-amber-400 font-Montserrat text-xs sm:text-sm font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-amber-300 hover:text-amber-400 font-Montserrat text-xs sm:text-sm font-semibold">
                  Shop
                </Link>
              </li>
              <li className="relative group">
                <button className="text-amber-300 hover:text-amber-400 font-Montserrat text-xs sm:text-sm font-semibold">
                  Best Picks
                </button>
                <ul className="absolute hidden group-hover:block bg-navy-800 text-white rounded-md shadow-lg mt-2 p-2 w-40 sm:w-48">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-amber-300 hover:bg-navy-700 hover:text-amber-400"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link href="/contact" className="text-amber-300 hover:text-amber-400 font-Montserrat text-xs sm:text-sm font-semibold">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Search />
              <Link href="/wishlist" aria-label="Wishlist">
                <HiOutlineHeart className="w-5 sm:w-6 h-5 sm:h-6 text-myLgold hover:text-myDgold transition-colors duration-200" />
              </Link>
              <Link href="/cart" className="relative" aria-label="Cart">
                <HiOutlineShoppingBag className="w-5 sm:w-6 h-5 sm:h-6 text-myLgold hover:text-myDgold transition-colors duration-200" />
                {totalItemsInCart > 0 && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-amber-500 text-navy-900 text-[10px] sm:text-xs font-bold rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Search />
            <button onClick={toggleMenu} className="text-amber-300 focus:outline-none" aria-label="Toggle menu">
              <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col items-center space-y-3 py-4 bg-navy-800">
            <li>
              <Link href="/" className="text-amber-300 hover:text-amber-400 font-Montserrat text-sm font-semibold" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-amber-300 hover:text-amber-400 font-Montserrat text-sm font-semibold" onClick={toggleMenu}>
                Shop
              </Link>
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-400 font-Montserrat text-sm font-semibold"
                  onClick={toggleMenu}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-amber-300 hover:text-amber-400 font-Montserrat text-sm font-semibold" onClick={toggleMenu}>
                Contact
              </Link>
            </li>
            <div className="flex space-x-6">
              <Link href="/wishlist" aria-label="Wishlist" onClick={toggleMenu}>
                <HiOutlineHeart className="w-6 h-6 text-myLgold hover:text-myDgold" />
              </Link>
              <Link href="/cart" className="relative" aria-label="Cart" onClick={toggleMenu}>
                <HiOutlineShoppingBag className="w-6 h-6 text-myLgold hover:text-myDgold" />
                {totalItemsInCart > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-navy-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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