import { useState,useEffect } from "react";

type myreturnNumber={
  returnNumber:Function
}


const Sidebar =({returnNumber}:myreturnNumber)=>{

const [isPresesd,setIsPressed]=useState(0)

const SetButtonNumber=(sendbutton:String)=>{
  const sendButtonStateRedis=async ()=>{
    await fetch("http://127.0.0.1:8001/button/setsidebarLastButton",{method:"PUT",
      headers:{"Content-Type": "application/json"},body: JSON.stringify({button_value: sendbutton})})
      }
    sendButtonStateRedis()
      switch (sendbutton) {
        case "Control":
          setIsPressed(0);
          returnNumber("Control")
          break;
        case "Settings":
          setIsPressed(1);
          returnNumber("Settings")
          break;
        case "Event mode":
          setIsPressed(2);
          returnNumber("Event mode")
          break;
        case "Table Mode":
          setIsPressed(3);
          returnNumber("Table Mode")
          break;
        case "Specialization":
          setIsPressed(4);
          returnNumber("Specialization")
          break;
        case "Information":
          setIsPressed(5);
          returnNumber("Information")
          break;
        case "Wifi Settings":
          setIsPressed(6);
          returnNumber("Wifi Settings")
          break;
      }
}


useEffect(() => {
  const fetchData = async () => {
    const resp = await fetch("http://127.0.0.1:8001/button/sidebarButtonState",{method:"GET"})
    const data = await resp.json()

    const sendbutton=data["lastbutton"]
    
    switch (sendbutton) {
      case "Control":
        setIsPressed(0);
        returnNumber("Control")
        break;
      case "Settings":
        setIsPressed(1);
        returnNumber("Settings")
        break;
      case "Event mode":
        setIsPressed(2);
        returnNumber("Event mode")
        break;
      case "Table Mode":
        setIsPressed(3);
        returnNumber("Table Mode")
        break;
      case "Specialization":
        setIsPressed(4);
        returnNumber("Specialization")
        break;
      case "Information":
        setIsPressed(5);
        returnNumber("Information")
        break;
      case "Wifi Settings":
        setIsPressed(6);
        returnNumber("Wifi Settings")
        break;
    }

  }
  fetchData()
})

  return (
    <div className="bg-stone-600 rounded-l-lg p-3">
      <div className="grid grid-cols-1 px-8 py-10">
        <button className={isPresesd===0? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Control")}>Control</button>
        <button className={isPresesd===1? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Settings")}>Settings</button>
        <button className={isPresesd===2? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Event mode")}>Event mode</button>
        <button className={isPresesd===3? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Table Mode")}>Table Mode</button>
        <button className={isPresesd===4? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Specialization")}>Specialization</button>
        <button className={isPresesd===5? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Information")}>Information</button>
        <button className={isPresesd===6? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Wifi Settings")}>Wifi Settings</button>
        {/* <button className="sidebarButtons " onClick={()=>returnNumber("Control")}>Control</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Settings")}>Settings</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Event mode")}>Event mode</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Table Mode")}>Table Mode</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Specialization")}>Specialization</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Information")}>Information</button>
        <button className="sidebarButtons " onClick={()=>returnNumber("Wifi Settings")}>Wifi Settings</button> */}
      </div>
    </div>
  )
}

export default Sidebar;