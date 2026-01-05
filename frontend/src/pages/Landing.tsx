import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shoppingSvg from "../assets/shopping-cart-svgrepo-com.svg";
import webshopping from "../assets/online-shopping-concept.jpg";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 sm:px-16 py-5 shadow-sm bg-white/90 backdrop-blur-sm border-b border-gray-100 relative">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={shoppingSvg} alt="Online shop" className="h-7 w-7" />
          <h1 className="text-2xl font-bold tracking-tight">LocalLink</h1>
        </div>

        {/* Desktop buttons */}
        <nav className="hidden sm:flex items-center space-x-4">
          <button
            onClick={() => navigate("/signup-as-user")}
            className="px-5 py-2 rounded-md text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
          >
            Register as User
          </button>
          <button
            onClick={() => navigate("/signup-as-business")}
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Register as Business
          </button>
        </nav>

        {/* Hamburger (mobile only) */}
        <button
          className="sm:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-full right-6 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col p-3 gap-2 sm:hidden">
            <button
              onClick={() => navigate("/signup-as-user")}
              className="w-full px-4 py-2 text-left rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Register as User
            </button>
            <button
              onClick={() => navigate("/signup-as-business")}
              className="w-full px-4 py-2 text-left rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Register as Business
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-6 sm:px-16 py-14 sm:py-20 gap-12">
        <div className="flex-1 max-w-lg text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Connect, Grow, and Discover
            <br />
            Businesses Around You.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            LocalLink helps businesses build their online presence and lets users
            explore local shops, products, and services. Network, engage, and
            grow together — all in one place.
          </p>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={webshopping}
            alt="Business collaboration"
            className="rounded-xl w-full max-w-sm sm:max-w-md md:max-w-3xl object-cover"
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
