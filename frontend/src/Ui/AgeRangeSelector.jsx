import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const AgeRangeSelector = ({ age, setAge }) => {
  // parse the age string into numbers if it exists, else default
  const initial = age ? age.split("-").map(Number) : [0, 100];
  const [range, setRange] = useState(initial);

  // whenever range updates, update parent as "min-max"
  useEffect(() => {
    setAge(`${range[0]}-${range[1]}`);
  }, [range, setAge]);

  return (
    <div className="pb-3">
      <p className="text-xs pt-3 text-neutral-500 mb-1">
        Age Range: <span className="text-white">{range[0]} - {range[1]}</span>
      </p>
      <Slider
        range
        min={10}
        max={80}
        step={1}
        value={range}
        onChange={setRange}
        trackStyle={[{ backgroundColor: "#22c55e" }]}   // green track
        handleStyle={[
          { borderColor: "#22c55e", backgroundColor: "#fff" },
          { borderColor: "#22c55e", backgroundColor: "#fff" }
        ]}
        railStyle={{ backgroundColor: "#404040" }}
      />
    </div>
  );
};

export default AgeRangeSelector;
