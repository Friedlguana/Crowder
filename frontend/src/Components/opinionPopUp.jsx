import React from 'react'

const opinionPopUp = ({name,response}) => {
  return (
    <div className='bg-black w-[200px] h-[200px] flex items-center justify-center text-white font-mono'>
        <p>*{name}</p>
        <p>{response}</p>
    </div>
  )
}

export default opinionPopUp