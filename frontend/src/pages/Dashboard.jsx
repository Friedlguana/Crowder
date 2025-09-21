import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AgentActivity from "../Components/AgentActivity";
import PredictedSuccessRate from "../Components/PredictedSuccessRate";
import LeftSideBar from "../Components/LeftSideBar";
import Globe from 'react-globe.gl';
import GlobeComponent from "../Components/Globe";
import opinionPopUp from "../Components/opinionPopUp";

export default function Dashboard() {
    const [inputText,setInputText] = useState("");
    const [jsonObject, setJsonObject] = useState(null);

   const formatJson = (jsonString) => {
    try {
      // 1️⃣ Remove markdown fences ```json and ```
      const noFences = jsonString
        .replace(/```json/g, "")
        .replace(/```/g, "");

      // 2️⃣ Clean escaped characters if present
      const cleaned = noFences
        .replace(/\\n/g, "")
        .replace(/\\"/g, '"')
        .trim();

      // 3️⃣ Parse JSON
      const parsed = JSON.parse(cleaned);

      setJsonObject(parsed);
      console.log(parsed);
    } catch (error) {
      console.error("Invalid JSON string", error);
    }
  };

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
        formatJson(data.message.candidates[0].content.parts[0].text)
        console.log(data.message.candidates[0].content.parts[0].text); // log the actual message
      })
      .catch((err) => console.error("Error:", err));
    }

  return (
    <div className="h-screen relative font-mono bg-black text-white flex">
      {/* Left Sidebar */}
      <LeftSideBar />

      {/* Center Globe Section */}
      <main className="flex-1 flex z-0 flex-col relative items-center justify-center">
        
        <div className="w-[750px] h-[750px] z-0 flex items-center justify-center">
          {/* Placeholder for Globe */}
          <div className="text-neutral-600">
            <GlobeComponent />
          </div>
        </div>

        {/* Input Box */}
        <div className="absolute z-10 bottom-8 w-2/3 bg-neutral-900 border border-neutral-800 p-3 flex items-center justify-between rounded">
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
      <aside className="w-100 border-l z-10 overflow-y-auto border-neutral-800 flex flex-col p-4 space-y-6">
        
        {/* Analysis Input */}
        <div className="border border-neutral-800 min-h-[200px] p-4 rounded">
          <p className="text-blue-400 text-lg mb-2">ANALYSIS INPUT</p>
          <div className="text-sm bg-gray-900 px-3 py-5 mb-3 overflow-auto h-40 whitespace-pre-wrap">{inputText} </div>
          <p className="text-xs text-neutral-500">
            When you’re ready, deploy your idea to the whole world
          </p>
        </div>
        {/* Mission Status */}
        <PredictedSuccessRate />

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
