// A simple in-memory session store
// This will reset when the page is refreshed
// For persistence, replace with localStorage or sessionStorage

let sessionData = {};

/**
 * Save data into the session
 * @param {string} key 
 * @param {*} value 
 */
export function setSession(key, value) {
  sessionData[key] = value;
}

/**
 * Get data from the session
 * @param {string} key 
 * @returns {*}
 */
export function getSession(key) {
  return sessionData[key];
}

/**
 * Get the whole session object
 * @returns {object}
 */
export function getAllSession() {
  return { ...sessionData };
}

/**
 * Remove a key from session
 * @param {string} key 
 */
export function removeSession(key) {
  delete sessionData[key];
}

/**
 * Clear the entire session
 */
export function clearSession() {
  sessionData = {};
}


// import { setSession } from "./utils/session";

// fetch("http://127.0.0.1:8000/user/123")
//   .then((res) => res.json())
//   .then((data) => {
//     setSession("user", data); // save whole user object
//     setSession("username", data.username); // save specific fields if needed
//     setSession("id", data.id);
//   });

// import { getSession, getAllSession } from "./utils/session";

// const username = getSession("username");
// console.log("Username:", username);

// const allData = getAllSession();
// console.log("All session data:", allData);
