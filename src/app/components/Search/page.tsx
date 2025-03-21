"use client";
import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi"; // Modern search icon
import Link from "next/link";

// Mock data representing content from the entire website
const mockData = [
  { id: 1, title: "Frozen Pizza", category: "Shop", url: "/shop/frozen-pizza" },
  { id: 2, title: "Ready-to-Eat Pasta", category: "Shop", url: "/shop/pasta" },
  { id: 3, title: "Amy's Kitchen Burrito", category: "Best Picks", url: "https://www.amys.com/our-foods" },
  { id: 4, title: "Contact Us", category: "Page", url: "/contact" },
  { id: 5, title: "About MA Foods", category: "Page", url: "/about" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockData>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Handle search logic
  useEffect(() => {
    if (query.length > 0) {
      const filteredResults = mockData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative">
      {/* Search Icon to Toggle Input */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-myLgold hover:text-myDgold transition-colors duration-200"
        aria-label="Search"
      >
        <HiOutlineSearch className="w-6 h-6" />
      </button>

      {/* Search Input (Visible when open) */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-navy-800 rounded-md shadow-lg p-4 z-50">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search MA Foods..."
            className="w-full p-2 rounded-md bg-navy-700 text-amber-300 placeholder-amber-200 border border-navy-600 focus:outline-none focus:border-amber-400"
            autoFocus
          />

          {/* Search Results */}
          {query.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result) => (
                  <li key={result.id} className="py-2">
                    <Link
                      href={result.url}
                      target={result.url.startsWith("http") ? "_blank" : "_self"}
                      rel={result.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-amber-300 hover:text-amber-400 flex flex-col"
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <span className="font-Montserrat text-sm font-semibold">{result.title}</span>
                      <span className="text-xs text-navy-200">{result.category}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-amber-200 text-sm py-2">No results found</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;