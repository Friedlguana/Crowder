import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  emailSignin,
  googleSignin,
  getSession,
  githubSignin,
  logout,
} from "../lib/db";
import Toaster from "../Components/Toaster"; // import your toaster
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [toast, setToast] = useState(null);

  // Check session on mount
  useEffect(() => {
    (async () => {
      const userSession = await getSession();
      setSession(userSession);
    })();
  }, []);

  // Show toast
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000); // auto hide after 4s
  };

  // Handle Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await emailSignin(email, password);
      setSession({ user: userCredential.user });
      navigate("/projects");
    } catch (err) {
      console.error("Login error:", err);
      showToast("Error", err.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const userCredential = await githubSignin();
      setSession({ user: userCredential.user });
      navigate("/projects");
    } catch (err) {
      console.error("Github login error:", err);
      showToast("Error", err.message);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await googleSignin();
      setSession({ user: userCredential.user });
      navigate("/projects");
    } catch (err) {
      console.error("Google login error:", err);
      showToast("Error", err.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      setSession(null);
      showToast("Success", "Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Error", err.message);
    }
  };

  return (
    <div className="min-h-screen font-mono flex items-center justify-center bg-black text-white relative">
      {/* Background overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-b from-gray-900 to-black opacity-40 blur-3xl"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-[350px] bg-[#111] p-6 rounded-md shadow-lg">
        <div className="text-center mb-6">
          <div className="text-sm font-semibold">Crowder Inc.</div>
          <h2 className="mt-2 text-lg font-bold">Welcome back</h2>
          <p className="text-xs text-gray-400">
            Login with your Apple or Google account
          </p>
        </div>

        {/* If logged in, show session details */}
        {session ? (
          <div className="text-center text-sm text-green-400 mb-4">
            Logged in as: <b>{session.user.email}</b>
            <button
              onClick={handleLogout}
              className="ml-3 text-red-400 underline hover:text-red-300 text-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Social buttons */}
            <div className="flex flex-col gap-2 mb-4">
              <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center gap-2 w-full bg-black border border-gray-700 py-2 rounded-md text-sm hover:bg-gray-900">
                <FaGithub /> Login with Github
              </button>
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full bg-black border border-gray-700 py-2 rounded-md text-sm hover:bg-gray-900"
              >
                <span className="text-lg"><FaGoogle /></span> Login with Google
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 mb-4">
              Or continue with
            </div>

            {/* Input fields */}
            <form onSubmit={handleLogin} className="flex flex-col gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@example.com"
                className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black border border-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-gray-200"
              >
                Login
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="mt-4 mb-2 text-center text-xs text-gray-400">
          Don’t have an account?{" "}
          <Link to={"/signup"}>
            <div className="text-white mt-2 hover:underline">Sign up</div>
          </Link>
        </div>
        <div className="w-full text-center">
          <Link to={"/"}>
            <div className="text-xs text-white hover:underline">Go back</div>
          </Link>
        </div>

        <p className="mt-4 text-[10px] text-gray-500 text-center">
          By clicking continue, you agree to our{" "}
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

      {/* Toast notifications */}
      {toast && <Toaster title={toast.title} message={toast.message} />}
    </div>
  );
};

export default Login;
