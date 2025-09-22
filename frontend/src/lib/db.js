// db.js (or firebase.js)

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from "firebase/auth";

export let username = "";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "crowder-e26dc.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: "crowder-e26dc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_MESSAGE_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASEUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ----------------------
// Signup Helpers
// ----------------------

// Email/password signup
const emailSignup = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Google signup (popup)
const googleSignup = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// GitHub signup (popup)
const githubSignup = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};

// ----------------------
// Signin Helpers
// ----------------------

// Email/password login
const emailSignin = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Google login (popup)
const googleSignin = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// GitHub login (popup)
const githubSignin = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};

// ----------------------
// Session & Logout
// ----------------------

// Get current session
const getSession = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          user.getIdToken().then((token) => {
            username = user.displayName;
            resolve({ user, token });
          });
        } else {
          resolve(null);
        }
      },
      (error) => reject(error)
    );
  });
};

// Logout
const logout = async () => {
  return await signOut(auth);
};

// ----------------------
// Exports
// ----------------------
export {
  auth,
  emailSignup,
  googleSignup,
  githubSignup,
  emailSignin,
  googleSignin,
  githubSignin,
  logout,
  getSession,
};
