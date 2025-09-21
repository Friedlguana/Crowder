export default function AgentActivity({high=0,medium=0,low=0}) {

  let total = high + medium + low;
  let highPercentage=0;
  let mediumPercentage=0;
  let lowPercentage = 0;
  if(!(total<=0)){
    highPercentage = (high / total) * 100;
    mediumPercentage = (medium / total) * 100;  
    lowPercentage = (low / total) * 100;
    highPercentage = highPercentage.toFixed(2);
    mediumPercentage = mediumPercentage.toFixed(2);
    lowPercentage = lowPercentage.toFixed(2);
  }
  

  return (
    <div className="bg-black border-1 border-neutral-800 rounded-md text-white p-6 font-mono">
      {/* Title */}
      <h2 className="text-lg text-blue-400 tracking-wide mb-4">AGENT ACTIVITY</h2>

      {/* Activity Summary */}
      <div className="flex gap-12 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{high}</span>
          <span className="text-xs mt-1">High</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{medium}</span>
          <span className="text-xs mt-1">Medium</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{low}</span>
          <span className="text-xs mt-1">Low</span>
        </div>
      </div>

      {/* Engagement Bars */}
      <div className="space-y-4">
        {/* High Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>HIGH ENGAGEMENT</span>
            <span>{highPercentage}%</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-3 ${
                  i < (highPercentage/10) ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Medium Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>MEDIUM ENGAGEMENT</span>
            <span>{mediumPercentage}%</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-3 ${
                  i < ((mediumPercentage/10)) ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Low Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>LOW ENGAGEMENT</span>
            <span>{lowPercentage}%</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-3 ${
                  i < ((lowPercentage/10)) ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
