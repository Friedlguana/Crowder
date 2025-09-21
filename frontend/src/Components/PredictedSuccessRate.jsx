import React from 'react'
import Loader from './loader'

const PredictedSuccessRate = () => {
  return (
    <div className="border border-neutral-800 p-4 rounded">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-green-400 text-lg">PREDICTED SUCCESS RATE</span>
            <span className="text-neutral-500">ACTIVE</span>
          </div>
          <p className="text-xs text-neutral-400 mb-1">Impact Score</p>
          <div className="flex items-center space-x-2">
            <Loader isStatic={true} percentage={12} />
          </div>
          <p className="text-xs mt-2">Status: <span className="text-red-500">CRITICAL</span></p>
    </div>
  )
}

export default PredictedSuccessRate