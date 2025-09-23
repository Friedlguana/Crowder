import React, { useEffect, useState } from "react";
import LeftSideBar from "../Components/LeftSideBar";
import GlobeComponent from "../Components/Globe";
import OpinionPopUp from "../Components/opinionPopUp";
import OpinionCard from "../Components/OpinionCard";
import AgentActivity from "../Components/AgentActivity";
import PredictedSuccessRate from "../Components/PredictedSuccessRate";
import CustomersTestimoniesGrid from "../Components/Feedback";
import LoadingScreen from "../Components/LoadingScreen";
import ShinyText from "../Ui/ShinyText";
import { addPoints } from "../../utils/pointsData";
import { addResponse, getResponses } from "../../utils/AgentResponses";
import { ActiveProject } from "../lib/utils";
import {
  getSession,
} from "../lib/db";

export default function Dashboard() {
  const [perc, setPerc] = useState(0);
  const [inputText, setInputText] = useState("");
  const [jsonObject, setJsonObject] = useState({});
  const [session, setSession] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [point, setPoint] = useState(0);
  const [agentData, setAgentData] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });
  const [sentimentScore, setSentimentScore] = useState(0);
  const [allResponses, setAllResponses] = useState([]); // ✅ useState instead of plain var
  const [number,setNumber] = useState(1);
  const [age,setAge] = useState("");
  const [region,setRegion] = useState("");
  const [industry,setIndustry] = useState("");


const handleSubmit = () => {
  if (!inputText.trim()) return Promise.resolve();

  return fetch("http://127.0.0.1:8000/api/submitIdea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea_text: inputText, age, region, industry }),
  })
    .then((res) => res.json())
    .then((data) => {
      setJsonObject(data.message);
      setPoint((prev) => prev + 1);
      setShowPopup(true);

      // Add response + globe point
      addResponse(data.message);
      addPoints({
        lat: Number(data.message.latitude || 0),
        lng: Number(data.message.longitude || 0),
        size: 1,
      });

      // Update agent distribution
      if (data.message.sentimentScore !== undefined) {
        calculateAgents(Number(data.message.sentimentScore));
      }

      // Refresh response list
      setAllResponses(getResponses());
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

const UpdateDataBase = async (sessionObj) => {
  const resp = await getResponses();
  const res = await fetch(`http://127.0.0.1:8000/update_project/${ActiveProject.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionObj?.token || ""}`,
    },
    body: JSON.stringify({ agentsArray: resp, latestIdea: inputText }),
  });

  const data = await res.json();
  console.log(data);
};


  const calculateAgents = (score) => {
    setSentimentScore((prev) => prev + score);

    if (score < 33) {
      setAgentData((prev) => ({ ...prev, low: prev.low + 1 }));
    } else if (score < 66) {
      setAgentData((prev) => ({ ...prev, medium: prev.medium + 1 }));
    } else {
      setAgentData((prev) => ({ ...prev, high: prev.high + 1 }));
    }
  };

 const baaphandle = async () => {
  if (!inputText.trim()) return;

  setLoading(true);
  const temp = await getSession();
  setSession(temp);
  setPerc(0);

  let completed = 0;

  try {
    const promises = [];
    for (let i = 0; i < number; i++) {
      const p = handleSubmit().finally(() => {
        completed++;
        setPerc(Math.round((completed / number) * 100));
      });
      promises.push(p);
    }
    await Promise.all(promises);
  } catch (err) {
    console.error("Batch error:", err);
  } finally {
    setLoading(false); // ✅ stop loading once all done
    UpdateDataBase(temp); 
  }
};



  

  return (
    <div className="h-screen relative font-mono bg-black text-white flex">
      {/* Left Sidebar */}
      <LeftSideBar number={number} age={age} region={region} industry={industry} setAge={setAge} setRegion={setRegion} setIndustry={setIndustry} setNumber={setNumber} />
      {loading && <LoadingScreen perc={perc} onClose={() => {
              setLoading(false);
      }}/>}
            {showFeedback && <CustomersTestimoniesGrid
            response ={allResponses}
            onClose={() => setShowFeedback(false)}
            />}

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
        <div className="absolute z-10 bottom-8 w-3/4 bg-neutral-800 shadow-xl shadow-white/20 border border-neutral-800 p-3 flex items-center justify-between rounded-full">
          <input
            type="text"
            className="bg-transparent py-5 px-5 outline-none flex-1 text-sm"
            placeholder="Describe your idea ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                baaphandle();
              }
            }}
          />
          <button
            onClick={baaphandle}
            className="bg-neutral-700 shadow-lg shadow-white/20 ease-in duration-200 active:translate-y-1 active:shadow-neutral-800 rounded-full px-6 py-3.5 text-xl hover:bg-neutral-600"
          >
             <ShinyText 
                text="↑" 
                disabled={false} 
                speed={3} 
                className='custom-class text-amber-100' 
              />
            
          </button>
        </div>

      </main>

      {/* Right Sidebar */}
      <aside className="w-100 border-l z-10 overflow-y-auto border-neutral-800 flex flex-col p-4 space-y-6">
        {/* Analysis Input */}
        <div className="border border-neutral-800 min-h-[200px] p-4 rounded">
          <p className="text-blue-400 text-lg mb-2">ANALYSIS INPUT</p>
          <div className="text-sm bg-gray-900 px-3 py-2 mb-3 overflow-auto h-25 whitespace-pre-wrap">
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
          <p className="text-orange-400 text-lg mb-2">FEEDBACK LIST ({allResponses.length})</p>
          <p onClick={() => setShowFeedback(true)} className="text-xs cursor-pointer text-neutral-500">
            See All Responses ➚
          </p>
        </div>
      </aside>
    </div>
  );
}
