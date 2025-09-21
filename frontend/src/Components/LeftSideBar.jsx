import React from 'react'
import { Link } from 'react-router-dom'

const LeftSideBar = () => {
  return (
    <aside className="w-64 z-10 border-r border-neutral-800 flex flex-col p-4">
        <div className="flex  space-x-2 mb-4">
            <div className="text-2xl font-bold"><Link to={"/"}>Crowder</Link> /</div>
            <span className="text-neutral-400 pt-[5px]">Dashboard</span>
        </div>

        <div className="mb-6">
            <Link to={"/projects"}>
                <button className=" hover:bg-neutral-700 px-4 py-2 rounded text-sm w-full ">
                  ← Projects View
                </button>
            </Link>
        </div>

        {/* Society Dropdown */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1">Current Society</p>
          <select className="bg-neutral-900 text-white w-full p-2 rounded border border-neutral-800 text-sm">
            <option>Startup Investors</option>
          </select>
        </div>

        <button className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded text-sm w-full mb-6">
          + Create New Session
        </button>

        {/* Analysis Sessions */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-neutral-500 mb-2">Analysis Sessions</p>
          <ul className="space-y-2 text-sm">
            <li className="truncate">i want to build a fintech... <span className="text-neutral-500 block text-xs">9/14/2025</span></li>
            <li className="truncate">i want to create a fintec... <span className="text-neutral-500 block text-xs">9/14/2025</span></li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-500 mt-4">
          199 Auth0 users loaded
          <br />
          No analysis running
          <br />
          <span className="block mt-2">Version 2.1</span>
        </div>
      </aside>
  )
}

export default LeftSideBar