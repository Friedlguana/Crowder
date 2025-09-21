import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/loader";
import AgentActivity from "../Components/AgentActivity";

export default function Dashboard() {
    const [inputText,setInputText] = useState("");

    const handleSubmit=()=>{
    fetch("http://127.0.0.1:8000/api/submitIdea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "idea_text": inputText,
      }),
    })
      .then((res) => res.json())   // parse response as JSON
      .then((data) => {
        console.log(data.message); // log the actual message
      })
      .catch((err) => console.error("Error:", err));
    }

  return (
    <div className="h-screen font-mono bg-black text-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-neutral-800 flex flex-col p-4">
        <div className="flex  space-x-2 mb-4">
            <div className="text-2xl font-bold"><Link to={"/"}>Crowder</Link> /</div>
            <span className="text-neutral-400 pt-[5px]">Dashboard</span>
        </div>

        <div className="mb-6">
            <Link to={"/projects"}>
                <button className=" hover:bg-neutral-700 px-4 py-2 rounded text-sm w-full ">
                  ← Projects View
                </button>
            </Link>
        </div>

        {/* Society Dropdown */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1">Current Society</p>
          <select className="bg-neutral-900 text-white w-full p-2 rounded border border-neutral-800 text-sm">
            <option>Startup Investors</option>
          </select>
        </div>

        <button className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded text-sm w-full mb-6">
          + Create New Session
        </button>

        {/* Analysis Sessions */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-neutral-500 mb-2">Analysis Sessions</p>
          <ul className="space-y-2 text-sm">
            <li className="truncate">i want to build a fintech... <span className="text-neutral-500 block text-xs">9/14/2025</span></li>
            <li className="truncate">i want to create a fintec... <span className="text-neutral-500 block text-xs">9/14/2025</span></li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-500 mt-4">
          199 Auth0 users loaded
          <br />
          No analysis running
          <br />
          <span className="block mt-2">Version 2.1</span>
        </div>
      </aside>

      {/* Center Globe Section */}
      <main className="flex-1 flex flex-col relative items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          {/* Placeholder for Globe */}
          <span className="text-neutral-600">[Globe Visualization]</span>
        </div>

        {/* Input Box */}
        <div className="absolute bottom-8 w-2/3 bg-neutral-900 border border-neutral-800 p-3 flex items-center justify-between rounded">
          <input
            type="text"
            className="bg-transparent outline-none flex-1 text-sm"
            placeholder="Describe your idea ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)} // update state
          />
          <button onClick={()=>handleSubmit()} className="bg-neutral-800 px-3 py-1 rounded text-sm hover:bg-neutral-700">
            Simulate
          </button>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-100 border-l overflow-y-auto border-neutral-800 flex flex-col p-4 space-y-6">
        
        {/* Analysis Input */}
        <div className="border border-neutral-800 min-h-[200px] p-4 rounded">
          <p className="text-blue-400 text-lg mb-2">ANALYSIS INPUT</p>
          <div className="text-sm bg-gray-900 px-3 py-5 mb-3 overflow-auto h-40 whitespace-pre-wrap">{inputText} </div>
          <p className="text-xs text-neutral-500">
            When you’re ready, deploy your idea to the whole world
          </p>
        </div>
        {/* Mission Status */}
        <div className="border border-neutral-800 p-4 rounded">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-green-400 text-lg">PREDICTED SUCCESS RATE</span>
            <span className="text-neutral-500">ACTIVE</span>
          </div>
          <p className="text-xs text-neutral-400 mb-1">Impact Score</p>
          <div className="flex items-center space-x-2">
            <Loader isStatic={true} percentage={12} />
            {/* <span className="text-lg font-bold">0</span>
            <div className="flex space-x-1">
                
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-1 h-3 bg-neutral-800"></div>
              ))}
            </div>
            <span className="text-xs">100</span> */}
          </div>
          <p className="text-xs mt-2">Status: <span className="text-red-500">CRITICAL</span></p>
        </div>

        {/* Agent Activity */}
        {/* <div className="border border-neutral-800 p-4 rounded">
          <p className="text-blue-400 text-lg mb-3">AGENT ACTIVITY</p>
          <div className="flex justify-between text-xs mb-2">
            <span>0 High</span>
            <span>0 Medium</span>
            <span>0 Low</span>
          </div>
          <div className="text-xs text-neutral-400 space-y-2">
            <div className="flex items-center space-x-2">
              <span>HIGH ENGAGEMENT</span>
              <span>0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>MEDIUM ENGAGEMENT</span>
              <span>0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>LOW ENGAGEMENT</span>
              <span>0</span>
            </div>
          </div>
        </div>*/}
        <AgentActivity /> 

        {/* Feedback List */}
        <div className="border border-neutral-800 p-4 rounded">
          <p className="text-orange-400 text-lg mb-2">FEEDBACK LIST (0)</p>
          <p className="text-xs text-neutral-500">No feedback collected yet</p>
        </div>

        
      </aside>
    </div>
  );
}
