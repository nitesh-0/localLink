import React from "react";
import { useNavigate } from "react-router-dom";
import shoppingSvg from "../assets/shopping-cart-svgrepo-com.svg";
import webshopping from "../assets/undraw_web-shopping_xd5k.png";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-16 py-5 shadow-sm bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={shoppingSvg} alt="Online shop" className="h-7 w-7" />
          <h1 className="text-2xl font-bold tracking-tight cursor-pointer">
            LocalLink.AI
          </h1>
        </div>

        <nav className="flex items-center space-x-4">
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
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-16 py-20 gap-10">
        {/* Left Content */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Connect, Grow, and Discover{" "}
            <br />
            Businesses Around You.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            LocalLink.AI helps businesses build their online presence and lets
            users explore local shops, products, and services. Network, engage,
            and grow together — all in one place.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-end">
          <img
            src={webshopping}
            alt="Business collaboration"
            className="rounded-xl shadow-lg max-w-md md:max-w-2xl object-cover"
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
