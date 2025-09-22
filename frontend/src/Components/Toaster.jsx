import React, { useEffect, useState } from "react";

const Toaster = ({ title, message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-20 z-50 animate-slide-up">
      <div className="bg-gray-900 w-[300px] text-white font-mono px-6 py-4 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-sm font-bold">{title}</h1>
        <p className="text-xs text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default Toaster;
