import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Loader = ({ isLoading = false, isStatic = false, percentage = 0 }) => {
  const totalBars = 40;
  const [progress, setProgress] = useState(0);
  const barsRef = useRef([]);

  // Handle progress logic
  useEffect(() => {
    if (isStatic) {
      setProgress(percentage);
      return;
    }

    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) =>
          prev < 95 ? Math.min(prev + Math.floor(Math.random() * 5), 95) : prev
        );
      }, 100);
    } else {
      if (progress < 100) {
        const timeout = setTimeout(() => {
          setProgress(100);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }

    return () => clearInterval(interval);
  }, [isLoading, isStatic, percentage]);

  // Run wave animation only once on mount
  useEffect(() => {
    if (!barsRef.current) return;

    gsap.fromTo(
      barsRef.current,
      { height: 0 },
      {
        height: "100%",
        duration: 0.5,
        stagger: 0.02,
        ease: "power3.out",
      }
    );
  }, []); // empty dependency → runs only once when component mounts

  // Calculate filled bars
  const filledBars = Math.round((progress / 100) * totalBars);
  const bars = Array.from({ length: totalBars }, (_, i) => i);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Percentage */}
      <div className="text-white mr-auto font-semibold">{progress}%</div>

      {/* Loader Bars */}
      <div className="w-full flex justify-center gap-[3px] h-8 items-end">
        {bars.map((bar, index) => (
          <div
            key={index}
            ref={(el) => (barsRef.current[index] = el)}
            className={`flex-1 transition-colors duration-300 ${
              index < filledBars ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
