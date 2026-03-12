import { useState } from "react";

type myreturnNumber={
  returnNumber:Function
}

// const Sidebar = ({ getPageNumber }: { getPageNumber: (num: number) => void }) => {
  const Sidebar =({returnNumber}:myreturnNumber)=>{
  return (
    <div className="bg-stone-600 rounded-l-lg p-3">
      <div className="grid grid-cols-1 px-8 py-10">
        <button className="sidebarButtons " onClick={()=>returnNumber("Control")}>Control</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Settings")}>Settings</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Event mode")}>Event mode</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Table Mode")}>Table Mode</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Specialization")}>Specialization</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Information")}>Information</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Wifi Settings")}>Wifi Settings</button>
      </div>
    </div>
  )
}

export default Sidebar;