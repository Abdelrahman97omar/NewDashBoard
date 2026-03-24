import { useState } from "react";
import { useRosConnection } from "../../../connection-provider";

const SettingS=()=>{
  const { publishTopic } = useRosConnection();
  const [nextOptionState,togleNextOptionState]=useState(false)
  const [motorState,toglemotorState]=useState(false)

  const handleClearMap=()=>{
    publishTopic("/clear_map", "std_msgs/Bool", {
      data: true,
    });
  }

  const handleNextOptionOn = () => {
    const newState = !nextOptionState;
    togleNextOptionState(newState);
    publishTopic("/robot_apps/next_on", "std_msgs/Bool", {
      data: newState,  
    });
  };

  const handleSaveMap=()=>{
    publishTopic("/save_event_map", "std_msgs/Bool", {
      data: true,
    });
  }


  const handleLoadMap=()=>{
    publishTopic("/load_event_map", "std_msgs/Bool", {
      data: true,
    });
  }

  const handleSetMotor=()=>{
    const nextMotorState=!motorState
    toglemotorState(nextMotorState)
    publishTopic("/enable_motors", "std_msgs/Bool", {
      data: nextMotorState,
    });

  }

  const handleResumeMap=()=>{}
  const handlePauseMapping=()=>{}
  const handleClearvirtualPath=()=>{}
  const handleCreateVirtualPath=()=>{}
    return (
        <>
        <div className="grid grid-cols-3 pt-10">
          <div className={"grid grid-cols-1 py-8 px-20 gap-y-20"}>
            <button className={"dashboardSettingsButtons bg-orange-600" } onClick={handleClearMap}>
              Clear Map
            </button>
            <button className="dashboardSettingsButtons bg-orange-600" onClick={handleResumeMap}>
              Resume Map
            </button>
            <button className={nextOptionState===true?
            "bg-green-500 dashboardSettingsButtons":"dashboardSettingsButtons bg-orange-600" } onClick={handleNextOptionOn}>
              Next Option On
            </button>
          </div>
  
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20">
            <button className="dashboardSettingsButtons bg-orange-600" onClick={handleSaveMap}>
              Save Map
            </button>
            <button className="dashboardSettingsButtons bg-orange-600" onClick={handlePauseMapping}>
              Pause Mapping
            </button>
            <button className="dashboardSettingsButtons " onClick={handleClearvirtualPath}>
              Clear Virtual Path
            </button>
          </div>

          <div className="grid grid-cols-1 py-8 px-20 gap-y-20 ">
            <button className="dashboardSettingsButtons bg-orange-600" onClick={handleLoadMap}>
              Load Map
            </button>
            <button className="dashboardSettingsButtons" onClick={handleCreateVirtualPath}>
              Create Virtual Path
            </button>
            <button className={motorState? "bg-green-500 dashboardSettingsButtons":"bg-orange-600 dashboardSettingsButtons"} onClick={handleSetMotor}>
              Set Motor On
            </button>
          </div>
        </div>
        </>
      );
}
export default SettingS;