import React from "react";
import Loader from "../Components/loader";
import { Link } from "react-router-dom";

const projects = [
  { name: "hackthenorth", date: "Sep 14, 2025",perc:20 },
  { name: "frf", date: "Sep 14, 2025",perc:45 },
  { name: "ytytyt", date: "Sep 14, 2025",perc:57 },
  { name: "yco", date: "Sep 14, 2025",perc:80 },
  { name: "vapi", date: "Sep 14, 2025",perc:98 },
  { name: "yc", date: "Sep 14, 2025",perc:12 },
];
const username = "rijul"

export default function Dashboard() {
  return (
    <div className="min-h-screen font-mono bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
        <div className="flex  space-x-2">
          <div className="text-2xl font-bold"><Link to={"/"}>Crowder</Link> /</div>
          <span className="text-neutral-400 pt-[5px]">Projects</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition">
            + New Project
          </button>
          <button className="text-sm text-neutral-400 hover:text-white">
            Logout →
          </button>
        </div>
      </header>

      {/* Welcome message */}
      <div className="px-8 py-6">
        <h1 className="text-xl font-semibold">Welcome {username},</h1>
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
              You are on track to reach engagement goals.
            </p>

            {/* Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between mt-1">
                <div className="w-3/4">
                    <Loader isStatic={true} percentage={project.perc} />
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
            <p className="text-xs text-neutral-500 mb-4">↑ 0 simulations</p>

            {/* Open Button */}
            <Link to={"/dashboard"}>
                <button className="w-full bg-neutral-100 text-black py-2 text-sm font-semibold rounded hover:bg-white transition">
                  Open Project →
                </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
