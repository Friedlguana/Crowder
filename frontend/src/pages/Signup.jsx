import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen font-mono flex items-center justify-center bg-black text-white relative">
        
      {/* Background overlay (tunnel effect placeholder) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-b from-gray-900 to-black opacity-40 blur-3xl"></div>
      </div>

      {/* Signup card */}
      <div className="relative z-10 w-[350px] bg-[#111] p-6 rounded-md shadow-lg">
        <div className="text-center mb-6">
          <div className="text-sm font-semibold">Crowder Inc.</div>
          <h2 className="mt-2 text-lg font-bold">Create an account</h2>
          <p className="text-xs text-gray-400">
            Sign up with your Apple or Google account
          </p>
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-2 mb-4">
          <button className="flex items-center justify-center gap-2 w-full bg-black border border-gray-700 py-2 rounded-md text-sm hover:bg-gray-900">
             Sign up with Apple
          </button>
          <button className="flex items-center justify-center gap-2 w-full bg-black border border-gray-700 py-2 rounded-md text-sm hover:bg-gray-900">
            <span className="text-lg">G</span> Sign up with Google
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 mb-4">
          Or continue with
        </div>

        {/* Input fields */}
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="email"
            placeholder="me@example.com"
            className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Signup button */}
        <button className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-200">
          Sign up
        </button>

        {/* Footer */}
        <div className="mt-4 w-full text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"}>
              <a className="text-white hover:underline">
                Login
              </a>
          </Link>
          
        </div>
        <div className="w-full text-center">
            <Link to={"/"}>
                  <a className="text-xs text-white hover:underline">
                    Go back
                  </a>
              </Link>
        </div>

        <p className="mt-4 text-[10px] text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Signup;
