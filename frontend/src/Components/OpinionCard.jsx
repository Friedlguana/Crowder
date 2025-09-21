import React from "react";

const OpinionCard = ({ response , onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="bg-neutral-900 text-white font-sans rounded-lg shadow-xl w-[450px] p-6 border border-neutral-700">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">{response.name}</h2>

        {/* Info section */}
        <div className="text-sm space-y-1 mb-4">
          <p>
            <span className="text-neutral-400">Title:</span> {response.jobTitle}
          </p>
          <p>
            <span className="text-neutral-400">Location:</span> {response.city}, {response.country}
          </p>
          <p>
            <span className="text-neutral-400">Age:</span> {response.age}
          </p>
          <p>
            <span className="text-neutral-400">Industry:</span> {response.jobIndustry}
          </p>
        </div>

        <hr className="border-neutral-700 mb-4" />

        {/* Reaction section */}
        <h3 className="text-lg mb-2">Reaction</h3>
        <p className="text-sm italic text-neutral-400">
          "{response.review}"
        </p>

        {/* Footer buttons */}
        <div className="flex justify-between mt-6">
          <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-sm">
            <span className="inline-block transform mr-2 -rotate-45">🕻</span> Call {response.name}
          </button>
          <button
            onClick={onClose}
            className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpinionCard;
