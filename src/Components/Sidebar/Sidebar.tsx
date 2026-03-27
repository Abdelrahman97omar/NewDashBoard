import { useState} from "react";

type myreturnNumber={
  returnNumber:Function
}


const Sidebar =({returnNumber}:myreturnNumber)=>{

let lastPressedButton=sessionStorage.getItem("currentPage")
if (lastPressedButton===null)
  {
    lastPressedButton="Control"
    returnNumber("Control")
  }
else
{
  returnNumber(lastPressedButton)
}
const [isPresesd,setIsPressed]=useState(lastPressedButton)


const SetButtonNumber=(sendbutton:string)=>{ 
  sessionStorage.setItem("currentPage",sendbutton)
      switch (sendbutton) {
        case "Control":
          setIsPressed("Control");
          returnNumber("Control")
          break;
        case "Settings":
          setIsPressed("Settings");
          returnNumber("Settings")
          break;
        case "Event mode":
          setIsPressed("Event mode");
          returnNumber("Event mode")
          break;
        case "Table Mode":
          setIsPressed("Table Mode");
          returnNumber("Table Mode")
          break;
        case "Specialization":
          setIsPressed("Specialization");
          returnNumber("Specialization")
          break;
        case "Information":
          setIsPressed("Information");
          returnNumber("Information")
          break;
        case "Wifi Settings":
          setIsPressed("Wifi Settings");
          returnNumber("Wifi Settings")
          break;
      }
}

  return (
    <div>
        <button className={isPresesd==="Control"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Control")}>Control</button>
        <button className={isPresesd==="Settings"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Settings")}>Settings</button>
        <button className={isPresesd==="Event mode"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Event mode")}>Event mode</button>
        <button className={isPresesd==="Table Mode"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Table Mode")}>Table Mode</button>
        <button className={isPresesd==="Specialization"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Specialization")}>Specialization</button>
        <button className={isPresesd==="Information"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Information")}>Information</button>
        <button className={isPresesd==="Wifi Settings"? "pressedSidebarButtons":"sidebarButtons"} onClick={()=>SetButtonNumber("Wifi Settings")}>Wifi Settings</button>
    </div>
  )
}

export default Sidebar;