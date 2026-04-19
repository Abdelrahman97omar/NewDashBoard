import { useRosConnection } from "../../../connection-provider";
import { useEffect, useState } from "react";
const Control = () => {
  const { publishTopic } = useRosConnection();
  const [isManual, setisManual] = useState(0);
  const [resumeState, setresumeState] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);

  const getRobotState = async () => {
    const resp = await fetch(
      `http://${window.location.hostname}:8001/stausBar/States`,
      { method: "GET" }
    );
    const data = await resp.json();
    const all_topic_state = JSON.parse(data);
    const robotSpeed = all_topic_state["robot_speed"];
    const robotMode = all_topic_state["manual_auto_mode"];
    // console.log("the robot speed is:",robotSpeed,"of type:",typeof(robotSpeed))
    setSliderValue(Number(robotSpeed));
    setisManual(Number(robotMode));
  };

  useEffect(() => {
    getRobotState();
  }, []);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const new_speed = Number(event.target.value);
    if (new_speed <= 49) return;

    setSliderValue(new_speed);
    publishTopic("/set_speed", "std_msgs/Float32", { data: new_speed });
    console.log(new_speed);
  };

  const handleSetManual = () => {
    let newManualFlag = 0;
    if (isManual === 1) {
      newManualFlag = 0;
      setisManual(0);
    } else if (isManual === 0) {
      newManualFlag = 1;
      setisManual(1);
    }
    publishTopic("/manual_flag", "std_msgs/Int32", {
      data: newManualFlag,
    });
  };

  const handleGoHome = () => {
    publishTopic("/go_home", "std_msgs/Int32", {
      data: 1,
    });
  };
  const handleResume = () => {
    let newResumeState = 0;

    if (resumeState === 1) {
      newResumeState = 0;
      setresumeState(0);
    } else if (resumeState === 0) {
      newResumeState = 1;
      setresumeState(1);
    }
    publishTopic("/resume", "std_msgs/Int32", {
      data: newResumeState,
    });
  };

  const handleNextPoint =()=>{
    
  }
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-3 h-full">
        <div className=" flex justify-around items-center h-full">
          <button
            className={
              isManual === 1 ? "pressedControlButtons" : "controlButtons"
            }
            onClick={handleSetManual}
          >
            {isManual === 1 ? "Set Auto" : "Set Manual"}
          </button>

          <button className="controlButtons" onClick={handleGoHome}>
            Go Home
          </button>

          <button
            className={`  ${
              resumeState === 1 ? "pressedControlButtons" : "controlButtons"
            }
            `}
            onClick={handleNextPoint}
          >
            Resume
          </button>

          <button
            className={`  ${
              resumeState === 1 ? "pressedControlButtons" : "controlButtons"
            }
            `}
            onClick={handleResume}
          >
            Next Point
          </button>
        </div>

        <div className="h-30  grid-rows-[15_1fr]  Cgray mx-9 rounded-3xl w-345">
          <div className="flex justify-center items-center px-30 pt-8 w-full">
            <p className="mr-6 text-3xl font-bold text-[#09203E]">Speed</p>
            <input
              className="Cgray h-6 accent-[#09203E] w-full"
              type="range"
              id="range-slider"
              min="0"
              max="100"
              step="1"
              value={sliderValue}
              onChange={handleSliderChange}
            />
          </div>
          <div className="flex justify-center items-center w-full">
            <p className="text-[#09203E] text-3xl font-bold ml-150 ">50%</p>
            <p className="text-[#09203E] text-3xl font-bold ml-110 ">
              {sliderValue}%
            </p>
          </div>
        </div>

        <div className=""></div>
      </div>
    </>
  );
};

export default Control;
