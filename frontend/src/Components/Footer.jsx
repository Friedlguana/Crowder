import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + About */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Crowder</h2>
          <p className="text-sm leading-relaxed">
            AI agents for simulated market research. Get a market analysis in
            minutes, not months.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-medium mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Team</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-medium mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Docs</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Support</a></li>
            <li><a href="#" className="hover:text-white">Changelog</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-medium mb-3">Stay Updated</h3>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 px-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2025 Crowder. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
