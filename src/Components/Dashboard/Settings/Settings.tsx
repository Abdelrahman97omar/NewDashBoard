import { useState } from "react";

const SettingS=()=>{

  const MyButton = async () => {
    const response = await fetch("http://127.0.0.1:8001/1", {
      method: "GET"
    })
  
    const data = await response.json()
    console.log(data)
  }
    return (
        <>
        <div className="grid grid-cols-3 pt-10">
          <div className={"grid grid-cols-1 py-8 px-20 gap-y-20"}>
            <button className={"dashboardSettingsButtons" } onClick={MyButton}>
              Clear Map
            </button>
            <button className="dashboardSettingsButtons">
              Resume Map
            </button>
            <button className="dashboardSettingsButtons">
              Next Option On
            </button>
          </div>
  
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20">
            <button className="dashboardSettingsButtons">
              Save Map
            </button>
            <button className="dashboardSettingsButtons">
              Pause Mapping
            </button>
            <button className="dashboardSettingsButtons">
              Clear Virtual Path
            </button>
          </div>
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20 ">
            <button className="dashboardSettingsButtons">
              Load Map
            </button>
            <button className="dashboardSettingsButtons">
              Create Virtual Path
            </button>
            <button className="dashboardSettingsButtons">
              Set Motor On
            </button>
          </div>
        </div>
        </>
      );
}
export default SettingS;