import React, { useState } from "react";
import { Link } from "react-router-dom";
import AgentActivity from "../Components/AgentActivity";
import PredictedSuccessRate from "../Components/PredictedSuccessRate";
import LeftSideBar from "../Components/LeftSideBar";
import GlobeComponent from "../Components/Globe";
import OpinionPopUp from "../Components/opinionPopUp";
import OpinionCard from "../Components/OpinionCard";
import { addPoints } from "../../utils/pointsData";

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [jsonObject, setJsonObject] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [show, setShow] = useState(false);
  const [point, setPoint] = useState(0);
  const [agentData, setAgentData] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });
  const [sentimentScore, setSentimentScore] = useState(0);

  const calculateAgents = (score) => {
    setSentimentScore((prev) => prev + score);

    if (score < 33) {
      setAgentData((prev) => ({
        ...prev,
        low: prev.low + 1,
      }));
    } else if (score < 66) {
      setAgentData((prev) => ({
        ...prev,
        medium: prev.medium + 1,
      }));
    } else {
      setAgentData((prev) => ({
        ...prev,
        high: prev.high + 1,
      }));
    }
  };

  const handleSubmit = () => {
    fetch("http://127.0.0.1:8000/api/submitIdea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idea_text: inputText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data.message);
        setJsonObject(data.message);
        setPoint((prev) => prev + 1);
        setShowPopup(true);

        // Add new globe point
        addPoints({
          lat: Number(data.message.latitude || 0),
          lng: Number(data.message.longitude || 0),
          size: 1,
        });

        // Update agents
        if (data.message.sentimentScore !== undefined) {
          calculateAgents(Number(data.message.sentimentScore));
        }

        console.log("Updated Sentiment:", sentimentScore, "Points:", point);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="h-screen relative font-mono bg-black text-white flex">
      {/* Left Sidebar */}
      <LeftSideBar />

      {/* Center Globe Section */}
      <main className="flex-1 flex z-0 flex-col relative items-center justify-center">
        {showPopup && (
          <OpinionPopUp
            setShow={setShow}
            response={jsonObject}
            onClose={() => setShowPopup(false)}
          />
        )}

        {show && (
          <OpinionCard
            response={jsonObject}
            onClose={() => {
              setShow(false);
              setShowPopup(true);
            }}
          />
        )}

        <div className="w-[750px] h-[750px] z-0 flex items-center justify-center">
          <div className="text-neutral-600">
            <GlobeComponent newpoint={point} />
          </div>
        </div>

        {/* Input Box */}
        <div className="absolute z-10 bottom-8 w-2/3 bg-neutral-900 border border-neutral-800 p-3 flex items-center justify-between rounded">
          <input
            type="text"
            className="bg-transparent outline-none flex-1 text-sm"
            placeholder="Describe your idea ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-neutral-800 px-3 py-1 rounded text-sm hover:bg-neutral-700"
          >
            Simulate
          </button>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-100 border-l z-10 overflow-y-auto border-neutral-800 flex flex-col p-4 space-y-6">
        {/* Analysis Input */}
        <div className="border border-neutral-800 min-h-[200px] p-4 rounded">
          <p className="text-blue-400 text-lg mb-2">ANALYSIS INPUT</p>
          <div className="text-sm bg-gray-900 px-3 py-5 mb-3 overflow-auto h-40 whitespace-pre-wrap">
            {inputText}
          </div>
          <p className="text-xs text-neutral-500">
            When you’re ready, deploy your idea to the whole world
          </p>
        </div>

        {/* Mission Status */}
        <PredictedSuccessRate
          sentimentScore={sentimentScore / (point === 0 ? 1 : point)}
        />

        {/* Agent Activity */}
        <AgentActivity
          high={agentData.high}
          medium={agentData.medium}
          low={agentData.low}
        />

        {/* Feedback List */}
        <div className="border border-neutral-800 p-4 rounded">
          <p className="text-orange-400 text-lg mb-2">FEEDBACK LIST (0)</p>
          <p className="text-xs text-neutral-500">No feedback collected yet</p>
        </div>
      </aside>
    </div>
  );
}
