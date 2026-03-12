import { useState } from "react";


const Sidebar = ({ getPageNumber }: { getPageNumber: (num: number) => void }) => {
  return (
    <div className="bg-stone-600 rounded-l-lg p-3">
      <div className="grid grid-cols-1 px-8 py-10">
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg " onClick={() => getPageNumber(1)}>Control</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Settings</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Evebt mode</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Table Mode</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Specialization</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Information</button>
        <button className="border py-2 mb-9 w-56 rounded-2xl shadow-lg ">Wifi Settings</button>
      </div>
    </div>
  )
}

export default Sidebar;