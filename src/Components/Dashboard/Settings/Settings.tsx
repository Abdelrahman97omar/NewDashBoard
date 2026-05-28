import { useEffect, useState,useRef } from "react";
import { useRosConnection } from "../../../connection-provider";

const SettingS = () => {
  const { publishTopic } = useRosConnection();
  const [motorState, toglemotorState] = useState<boolean | null>(null);
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
    console.log("the type od next option is", typeof(next_option_state) )
    console.log("the type od motor state is", typeof(motorState) )
    if (motorState === "True") {
      toglemotorState(true);
    } else {
      toglemotorState(false);
    }

    if (next_option_state === true) {
      togleIsNextOption(true);
    } 
    else if (next_option_state === false) {
      togleIsNextOption(false);
    }
  };

  const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
      ws.current = new WebSocket(`ws://${window.location.hostname}:9876`);
      ws.current.onopen = () => {
        console.log("Control tab is connected to websocket!");
      };
      ws.current.onmessage = (msg) => {
        const all_topic_state = JSON.parse(msg.data);

        if (all_topic_state["enable_motors"] == "True") {
          toglemotorState(true);
        } else {
          toglemotorState(false);
        }

        if (all_topic_state["next_option"] == true) {
          togleIsNextOption(true);
        } else {
          togleIsNextOption(false);
        }
  
      }
    },[])
  
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
    if (newState){
      publishTopic("/robot_apps/next_on", "std_msgs/Bool", {
        data: true,
      });
    }
    else if (!newState){
      publishTopic("/robot_apps/next_off", "std_msgs/Bool", {
        data: true,
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
    const nextMotorState = !(motorState ?? true);
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
      <div className="flex flex-col mt-10 md:mt-0 md:grid md:grid-cols-1 md:grid-rows-3 md:gap-y-12 md:pt-10">
        <div className="flex flex-col gap-3 pb-3 md:pb-0 md:gap-0 md:flex-row md:justify-around md:items-center">
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
        <div className="flex flex-col gap-3 pb-3 md:pb-0 md:gap-0 md:flex-row md:justify-around md:items-center">
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

        <div className="flex flex-col gap-3 md:flex-row md:justify-around md:items-center">
          <button
            className={
              isNextOption
                ? "pressedDashboardSettingsButtons"
                : "dashboardSettingsButtons "
            }
              onClick={() => {
                  handleNextOptionOn();
              }}
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
              motorState === null
                ? "dashboardSettingsButtons"
                : motorState
                ? "dashboardSettingsButtons"
                : "pressedDashboardSettingsButtons"
            }
            onClick={handleSetMotor}
          >
            {motorState === null ? "Set Motor Off" : motorState ? "Set Motor Off" : "Set Motor On"}
          </button>
        </div>
      </div>
    </>
  );
};
export default SettingS;
