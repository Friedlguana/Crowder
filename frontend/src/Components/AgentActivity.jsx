export default function AgentActivity() {
  return (
    <div className="bg-black border-1 border-neutral-800 rounded-md text-white p-6 font-mono">
      {/* Title */}
      <h2 className="text-sm text-blue-400 tracking-wide mb-4">AGENT ACTIVITY</h2>

      {/* Activity Summary */}
      <div className="flex gap-12 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">2</span>
          <span className="text-xs mt-1">High</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">18</span>
          <span className="text-xs mt-1">Medium</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">0</span>
          <span className="text-xs mt-1">Low</span>
        </div>
      </div>

      {/* Engagement Bars */}
      <div className="space-y-4">
        {/* High Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>HIGH ENGAGEMENT</span>
            <span>10</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-3 ${
                  i < 1 ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Medium Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>MEDIUM ENGAGEMENT</span>
            <span>90</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-3 ${
                  i < 9 ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Low Engagement */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>LOW ENGAGEMENT</span>
            <span>0</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-3 bg-gray-600"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
