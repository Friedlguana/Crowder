import React, { useEffect, useState } from "react";
import Loader from "../Components/loader";
import { Link } from "react-router-dom";
import {
  getSession,
  username,
  logout,
} from "../lib/db";

import { setActiveProject} from "../lib/utils"


const projects_test = [
  { name: "hackthenorth", date: "Sep 14, 2025",perc:20,id:"ClavPtz22qYXkp2c5XY4" },
  { name: "frf", date: "Sep 14, 2025",perc:45,id:"1234" },
  { name: "ytytyt", date: "Sep 14, 2025",perc:57,id:"1234" },
  { name: "yco", date: "Sep 14, 2025",perc:80,id:"1234" },
  { name: "vapi", date: "Sep 14, 2025",perc:98,id:"1234" },
  { name: "yc", date: "Sep 14, 2025",perc:12,id:"1234" },
];


export default function Projects() {
  const [session, setSession] = useState(null);
  const [createdProject,setCreatedProject] = useState(null);
  const [projectName,setProjectName] = useState("");
  const [projects,setProjects] = useState([]);
  const [showInput,setShowInput] = useState(false)



  const test = async() =>{
    const session = await getSession();
    // console.log("user",session.user)
    setSession(session);
    //   const res = await fetch("http://127.0.0.1:8000/get_user", {
    //     method: "GET",
    //     headers: {
    //       "Authorization": `Bearer ${session.token}`,  // 🔑 send token
    //     },
    //   });
    //   const data = await res.json();
  }

  const handleCreateProject = async () => {
  if (!projectName.trim()) return;

  const res = await fetch("http://127.0.0.1:8000/update_project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`,
    },
    body: JSON.stringify({ name: projectName }),
  });

  const data = await res.json();
  await fetchProjects();
  console.log("the ",data);
  setProjectName(""); // reset input
  setShowInput(false); // close input
};

const fetchProjects = async () => {
  if (!session) return;

  const res = await fetch("http://127.0.0.1:8000/get_projects", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${session.token}`,
    },
  });

  const data = await res.json();
  setProjects(data.projects);
  console.log("data",data.projects);
};

// utils function (inside Projects component or separate utils file)
const getAveragePerc = (agentsArray) => {
  if (!agentsArray || agentsArray.length === 0) return 0;
  
  const total = agentsArray.reduce((sum, agent) => {
    // Fallback to 0 if agent.perc doesn’t exist
    return sum + (agent.sentimentScore || 0);
  }, 0);

  return Math.round(total / agentsArray.length);
};


useEffect(() => {
  const init = async () => {
    const s = await getSession();
    setSession(s);
  };
  init();
}, []);

useEffect(() => {
  if (session) {
    fetchProjects();
  }
}, [session]);



  return (
    <div className="min-h-screen font-mono bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
        <div className="flex  space-x-2">
          <div className="text-2xl font-bold"><Link to={"/"}>Crowder</Link> /</div>
          <span className="text-neutral-400 pt-[5px]">Projects</span>
        </div>
        <div className="relative">
        <button
          onClick={() => setShowInput(!showInput)}
          className="bg-neutral-800 mr-5 cursor-pointer px-4 py-2 rounded hover:bg-neutral-700 transition"
        >
          + New Project
        </button>

        <input
          type="text"
          className={`absolute right-0 mt-2 px-5 py-2 rounded-lg w-[150px] bg-zinc-800
            transition-all duration-500 ease-out
            ${showInput ? "translate-y-15 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
          placeholder="Name"
          value={projectName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateProject();
            }
          }}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      </header>

      {/* Welcome message */}
      <div className="px-8 py-6">
        <h1 className="text-xl font-semibold">Welcome {username}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Manage your AI simulation projects and view insights
        </p>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-12">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="bg-neutral-900 border border-neutral-800 rounded-md p-5 flex flex-col justify-between"
          >
            {/* Labels */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-neutral-800 px-2 py-1 rounded">
                simulation
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-1 rounded">
                ai-powered
              </span>
              <span className="ml-auto text-xs text-neutral-500">
                {project.date}
              </span>
            </div>

            {/* Project Title */}
            <h2 className="font-semibold mb-2">{project.name}</h2>

            {/* Status */}
            <p className="text-sm text-neutral-400 mb-4">
              {project.latestIdea}
            </p>

            {/* Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between mt-1">
                <div className="w-3/4">
                    <Loader isStatic={true} percentage={getAveragePerc(project.agentsArray)}  />
                </div>
                {/* <div className="flex space-x-1">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-neutral-800"
                    ></div>
                  ))}
                </div> */}
                <span className="text-xs text-neutral-500">Phase 1</span>
              </div>
            </div>

            {/* Simulations */}
            <p className="text-xs text-neutral-500 mb-4">↑ {project.agentsArray.length} simulations</p>

            {/* Open Button */}
            <Link to={"/dashboard"} >
                <button onClick={()=>{setActiveProject(project)}} className="w-full cursor-pointer bg-neutral-100 text-black py-2 text-sm font-semibold rounded hover:bg-white transition">
                  Open Project →
                </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
