import React from "react";
import Loader from "./loader";

const LoadingScreen = ({ isloading , onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="bg-neutral-900 text-white font-sans rounded-lg shadow-xl w-[450px] p-6 border border-neutral-700">
        <Loader isStatic={false} isLoading={isloading} />
        <div className="flex justify-between mt-6">
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

export default LoadingScreen;
