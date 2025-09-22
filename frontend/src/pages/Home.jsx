import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LaserFlow from "../Ui/LaserFlow";
import Footer from "../Components/Footer";
import StarBorder from "../Ui/StarBorder";
import ShinyText from '../Ui/ShinyText';
import {
  getSession,
  logout,
} from "../lib/db";


const LandingPage = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

   const [session, setSession] = useState(null);

   const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
      setSession(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };
  
    // Check session on mount
    useEffect(() => {
      (async () => {
        const userSession = await getSession();
        setSession(userSession);
      })();
    }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-hidden">
        {/* Background Crowd (LaserFlow behind everything) */}
        <div className="absolute inset-0 -translate-y-55 -translate-x-10 z-10">
          <LaserFlow color="#b574ed" />
        </div>

        <div className="relative z-10 bg-transparent">
          {/* Pulse Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[200%] h-[200%] bg-transparent animate-pulse" />
          </div>

          {/* Navbar */}
          <header
            className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
              showNavbar ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex justify-between items-center px-8 py-2 bg-black/30 backdrop-blur-md ">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-sm" />{" "}
                {/* Logo placeholder */}
                <span className="font-bold tracking-wider">Crowder</span>
              </div>
              <div className="flex py-2 px-6 rounded-md space-x-8">
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
                <a href="#" className="hover:text-gray-300">
                  Team
                </a>
                <a href="#" className="hover:text-gray-300">
                  Contact Us
                </a>
              </div>
              <Link to={session?"/":"/login"}>
                {session?<p className="hover:text-gray-300 cursor-pointer" onClick={async () => {handleLogout();}}>LogOut ↗</p>:<p className="hover:text-gray-300">Login ↗</p>}
              </Link>
            </div>
          </header>

          {/* Hero Section */}
          <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-40 mb-30">
            <h1 className="text-4xl md:text-6xl pt-10 font-bold max-w-4xl leading-tight">
              AI agents for simulated market research
            </h1>
            <ShinyText 
                text="Get a market analysis in minutes, not months." 
                disabled={false} 
                speed={3} 
                className='custom-class text-amber-100' 
              />
            <p className="mt-4 text-gray-400">
              
            </p>
            <Link to={session?"/projects":"/login"}>
              <button className="mt-8 bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition">
                Explore Crowder ↗
              </button>
            </Link>
          </main>

          {/* Image Grid Section */}
          <section className="relative z-10 grid grid-cols-2 gap-6 px-8 py-16 max-w-6xl mx-auto">
            {/* Dashboard image */}
            <div className="col-span-2 row-span-2 relative group rounded-xl overflow-hidden">
              <StarBorder
                thickness={2}
                color="#b574ed"
                as="div"
                className="custom-class"
                speed="3s"
              >
                <img
                  src="dashboard.png"
                  alt="dashboard"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl border-transparent group-hover:animate-glow" />
              </StarBorder>
            </div>

            {/* Response image */}
            <div className="relative group rounded-xl overflow-hidden">
              <StarBorder
                thickness={2}
                color="#b574ed"
                as="div"
                className="custom-class"
                speed="4s"
              >
                <img
                  src="response.png"
                  alt="response"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl border-transparent group-hover:animate-glow" />
              </StarBorder>
            </div>

            {/* Feedback image */}
            <div className="relative group rounded-xl overflow-hidden">
              <StarBorder
                thickness={2}
                color="#b574ed"
                as="div"
                className="custom-class"
                speed="4s"
              >
                <img
                  src="feedback.png"
                  alt="feedback"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl border-transparent group-hover:animate-glow" />
              </StarBorder>
            </div>
          </section>
          
        </div>
      </div>
      

      <Footer />
    </>
  );
};

export default LandingPage;
