import { useEffect, useState } from 'react'
import Loader from './Components/loader'
import LandingPage from './pages/Home'
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';

function App() {
  const [loading, isLoading] = useState(true)
  useEffect(()=>{
    setTimeout(() => {
      isLoading(false)
    }, 1000);
  },[])

  useEffect(()=>{
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())   // parse response as JSON
      .then((data) => {
        console.log(data.message); // log the actual message
      })
      .catch((err) => console.error("Error:", err));

  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    // <>

    // <div className='loader-container min-h-[75px] max-h-[80px] min-w-[350px] h-[10vh] w-[30vw] bg-black'>
    //   <Loader isStatic={false} isLoading={loading} />
    // </div>
    // </>
  )
}

export default App
