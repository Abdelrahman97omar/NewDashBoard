import { useEffect, useState } from "react";
import { useRosConnection } from "../../../connection-provider";

const SettingS = () => {
  const { publishTopic } = useRosConnection();
  const [motorState, toglemotorState] = useState(false);
  const [isNextOption, togleIsNextOption] = useState<boolean>();

  const getRobotStates = async () => {
    const resp = await fetch(
      `http://${window.location.hostname}:8001/stausBar/States`,
      { method: "GET" }
    );
    const data = await resp.json();
    const all_topic_state = JSON.parse(data);
    const motorState = all_topic_state["enable_motors"];
    const next_option_state = all_topic_state["next_option"];
    console.log("The state of next option", next_option_state);
    console.log("The state of next option", typeof(next_option_state));
    if (motorState === "True") {
      toglemotorState(true);
    } else {
      toglemotorState(false);
    }

    if (next_option_state === "True") {
      console.log("TRUE FROM NEXT");
      togleIsNextOption(true);
    } 
    else if (next_option_state === "False") {
      console.log("False FROM NEXT");
      togleIsNextOption(false);
    }
  };

  useEffect(() => {
    getRobotStates();
  }, []);

  const handleClearMap = () => {
    publishTopic("/clear_map", "std_msgs/Bool", {
      data: true,
    });
  };

  const handleNextOptionOn = () => {
    const newState = !isNextOption;
    togleIsNextOption(newState);
    console.log("The newstate is:",newState)
    console.log("The newstate type ise:",typeof(newState))
    if (newState){
      console.log("New state of robotapps_next shiuld be on and it is:",newState)

      publishTopic("/robot_apps/next_on", "std_msgs/Bool", {
        data: newState,
      });
    }
    else if (!newState){
      console.log("New state of robotapps_next shiuld be of and it is:",newState)
      publishTopic("/robot_apps/next_off", "std_msgs/Bool", {
        data: newState,
      });
    }
  };

  const handleSaveMap = () => {
    publishTopic("/save_event_map", "std_msgs/Bool", {
      data: true,
    });
  };

  const handleLoadMap = () => {
    publishTopic("/load_event_map", "std_msgs/Bool", {
      data: true,
    });
  };

  const handleSetMotor = () => {
    console.log("the previous state is:", motorState);
    const nextMotorState = !motorState;
    toglemotorState(nextMotorState);
    publishTopic("/enable_motors", "std_msgs/Bool", {
      data: nextMotorState,
    });
  };

  const handleResumeMap = () => {
    publishTopic("/resume_mapping", "std_msgs/Bool", {
      data: true,
    });
  };
  const handlePauseMapping = () => {
    publishTopic("/pause_mapping", "std_msgs/Bool", {
      data: true,
    });
  };

  const handleClearvirtualPath = () => {};
  const handleCreateVirtualPath = () => {};

  return (
    <>
      <div className="grid grid-col-1 grid-rows-3 gap-y-12 pt-10">
        <div className="flex justify-around items-center">
          <button
            className={"dashboardSettingsButtons"}
            onClick={handleClearMap}
          >
            Clear Map
          </button>
          <button className="dashboardSettingsButtons " onClick={handleSaveMap}>
            Save Map
          </button>
          <button className="dashboardSettingsButtons " onClick={handleLoadMap}>
            Load Map
          </button>
        </div>
        <div className="flex justify-around items-center">
          <button
            className="dashboardSettingsButtons "
            onClick={handleResumeMap}
          >
            Resume Map
          </button>
          <button
            className="dashboardSettingsButtons "
            onClick={handlePauseMapping}
          >
            Pause Mapping
          </button>
          <button
            className="dashboardSettingsButtons"
            onClick={handleCreateVirtualPath}
          >
            Create Virtual Path
          </button>
        </div>

        <div className="flex justify-around items-center">

          <button
            className={
              isNextOption
                ? "pressedDashboardSettingsButtons"
                : "dashboardSettingsButtons "
            }
            onClick={()=>{
              console.log("RAW CLICK");
              handleNextOptionOn}
            }
          >
            {isNextOption ? "Set Next Option OFF" : "Set Next Option ON"}
          </button>

          <button
            className="dashboardSettingsButtons "
            onClick={handleClearvirtualPath}
          >
            Clear Virtual Path
          </button>
          <button
            className={
              motorState
                ? "dashboardSettingsButtons"
                : "pressedDashboardSettingsButtons"
            }
            onClick={handleSetMotor}
          >
            {motorState ? "Set Motor Off" : "Set Motor On"}
          </button>
        </div>
      </div>
    </>
  );
};
export default SettingS;
