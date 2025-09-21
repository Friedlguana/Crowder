import React from "react";

const OpinionPopUp = ({ setShow, response, onClose }) => {
  return (
    <div
      className="fixed top-10 cursor-pointer right-105 bg-black text-white font-mono border border-neutral-700 rounded p-3 max-w-[450px] shadow-lg z-50"
      style={{ pointerEvents: "auto" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-sm flex items-center">
          <span className="w-2 h-2 bg-white inline-block mr-2"></span>
          {response.name}
        </p>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Response */}
      <p onClick={()=>{
        onClose()
        setShow(true)
    }} className="text-sm text-neutral-300 italic line-clamp-3">
        {response.review}
      </p>
    </div>
  );
};

export default OpinionPopUp;
