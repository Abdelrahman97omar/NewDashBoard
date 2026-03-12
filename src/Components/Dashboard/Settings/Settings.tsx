import { useState } from "react";
const SettingS=()=>{
  const [isRed, setIsRed] = useState(0)

function MyButton() {
  setIsRed(1)
  // setTimeout(() => setIsRed(false), 500)
}
    return (
        <>
        <div className="grid grid-cols-3 pt-10">
          <div className={"grid grid-cols-1 py-8 px-20 gap-y-20"}>
            <button className={isRed ? "pressedDashboardSettingsButtons":"dashboardSettingsButtons" } onClick={MyButton}>
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