import React from 'react'
import Loader from './loader'

const PredictedSuccessRate = ({sentimentScore=0}) => {
  sentimentScore=sentimentScore.toFixed(2);
  return (
    <div className="border border-neutral-800 p-4 rounded">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-green-400 text-lg">PREDICTED SUCCESS RATE</span>
            <span className="text-neutral-500">ACTIVE</span>
          </div>
          <p className="text-xs text-neutral-400 mb-1">Sentiment Score</p>
          <div className="flex items-center space-x-2">
            <Loader isStatic={true} percentage={sentimentScore} />
          </div>
          <p className="text-xs mt-2">Status: <span className={sentimentScore<33?"text-red-500":sentimentScore<66?"text-yellow-500":"text-green-500"}>{sentimentScore<33?"CRITICAL":sentimentScore<66?"LOW":"HIGH"}</span></p>
    </div>
  )
}

export default PredictedSuccessRate