import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-hidden">
      {/* Background Crowd */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_80%)] animate-pulse" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex justify-between items-center px-8 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-sm" /> {/* Logo placeholder */}
          <span className="font-bold tracking-wider">Crowder</span>
        </div>
            <div className="flex py-4 px-8 rounded-md bg-gray-900 space-x-8">
              <a href="#" className="hover:text-gray-300">Home</a>
              <a href="#" className="hover:text-gray-300">About</a>
              <a href="#" className="hover:text-gray-300">Pricing</a>
              <div className="relative group">
                <button className="hover:text-gray-300">Discovery ▾</button>
                <div className="absolute hidden group-enabled:block bg-black text-sm mt-2 rounded shadow-lg p-2">
                  <a href="#" className="block px-3 py-1 hover:bg-gray-800">Option 1</a>
                  <a href="#" className="block px-3 py-1 hover:bg-gray-800">Option 2</a>
                </div>
              </div>
          </div>
          <Link to={"/login"}>
            <p className="hover:text-gray-300">Login ↗</p>
          </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-24">
        <div className="text-xs uppercase tracking-wider bg-gray-900 px-4 py-1 rounded-full mb-6">
          Latest update &nbsp; Cloudflare Workers AI Support Is Here! ↗
        </div>

        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
          AI agents for simulated market research
        </h1>

        <p className="mt-4 text-gray-400">
          Get a market analysis in minutes, not months.
        </p>

        <Link to={"/dashboard"}>
          <button className="mt-8 bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition">
            Explore Crowder ↗
          </button>
        </Link>
      </main>
    </div>
  );
};

export default LandingPage;
