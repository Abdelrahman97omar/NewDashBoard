import { useRosConnection } from "../../../connection-provider";
import Joystick from "rc-joystick";
import { useEffect, useState, useRef } from "react";
const Control = () => {
  const { publishTopic } = useRosConnection();
  const [isManual, setisManual] = useState(0);
  const [resumeState, setresumeState] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const ws = useRef<WebSocket | null>(null);
  const joystickRef = useRef<any>(null);

  const getRobotState = async () => {
    const resp = await fetch(
      `http://${window.location.hostname}:8001/stausBar/States`,
      { method: "GET" }
    );
    const data = await resp.json();
    const all_topic_state = JSON.parse(data);
    const robotSpeed = all_topic_state["robot_speed"];
    const robotMode = all_topic_state["manual_auto_mode"];

    setSliderValue(Number(robotSpeed));
    setisManual(Number(robotMode));
  };

  useEffect(() => {
    getRobotState();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:9876`);

    ws.current.onmessage = (msg) => {
      const all_topic_state = JSON.parse(msg.data);
      if (all_topic_state["manual_auto_mode"] === "1") {
        setisManual(1);
      } else {
        setisManual(0);
      }
      const robotSpeed = all_topic_state["robot_speed"];
      setSliderValue(Number(robotSpeed));


    };
  }, []);

  const handleSliderChange = (event: any) => {
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
    console.log("Resume is pressed");
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

  const handleNextPoint = () => {
    console.log("Next point is pressed");
    publishTopic("/next_toggle", "std_msgs/Int32", {
      data: 1,
    });
  };

  const handleJoystickChange = (val: any) => {
    if (!val || !val.distance || val.distance === 0) {
      publishTopic("/cmd_vel", "geometry_msgs/Twist", {
        linear: { x: 0.0, y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: 0.0 },
      });
      return;
    }

    const maxLinear = 0.35;
    const maxAngular = 0.65;
    const angleRad = ((val.angle - 90) * Math.PI) / 180;
    console.log("angleRad",angleRad)
    console.log("val.distance",val.distance)
    console.log("val.angle: ",val.angle)
    const linear_x = Math.cos(angleRad)  * maxLinear; 
    const angular_z = -Math.sin(angleRad)  * maxAngular;

    publishTopic("/cmd_vel", "geometry_msgs/Twist", {
      linear: { x: linear_x, y: 0.0, z: 0.0 },
      angular: { x: 0.0, y: 0.0, z: angular_z },
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] h-full">
        <div className="grid grid-cols-2 gap-x-2 md:flex justify-around items-center h-full mb-15">
          <button
            className={
              isManual === 1 ? "pressedControlButtons" : "controlButtons"}
            onClick={handleSetManual}
          >
            {isManual === 1 ? "Set Auto" : "Set Manual"}
          </button>

          <button className="controlButtons" onClick={handleGoHome}>
            Go Home
          </button>

          <button className="controlButtons" onClick={handleResume}>
            Resume
          </button>

          <button className="controlButtons" onClick={handleNextPoint}>
            Next Point
          </button>
        </div>


{/**/}
<div className="Cgray mx-3 lg:mx-9 rounded-3xl">

  <div className="flex items-center px-4 lg:px-10 pt-4 lg:pt-8 gap-3">
    <p className="text-base lg:text-3xl font-bold text-[#09203E] whitespace-nowrap">
      Speed
    </p>
    <input
      className="Cgray h-4 lg:h-6 accent-[#09203E] w-full"
      type="range"
      id="range-slider"
      min="0"
      max="100"
      step="1"
      value={sliderValue}
      onChange={handleSliderChange}
    />
  </div>
  <div className="grid grid-cols-3 items-center px-4 lg:px-10 pb-4 pt-1">
  <p className="text-base lg:text-3xl font-bold text-[#09203E] text-left invisible">
    placeholder
  </p>
  <p className="text-base lg:text-3xl font-bold text-[#09203E] text-center">
    50%
  </p>
  <p className="text-base lg:text-3xl font-bold text-[#09203E] text-right">
    {sliderValue}%
  </p>
</div>
</div>
{/**/}

        {/* <div className="h-30  grid-rows-[15_1fr] Cgray mx-9 rounded-3xl w-345">
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
        </div> */}
        {/* <div className="flex flex-col items-center justify-center h-full"> */}
        <div className="flex flex-col items-center pb-10 justify-center" style={{ height: "320px" }}>
          <Joystick
            ref={joystickRef}
            baseRadius={100}
            controllerRadius={35}
            insideMode={true}
            throttle={100}
            autoReset={true}
            onChange={handleJoystickChange}
          />
          <p className="text-sm text-gray-400">Drag to move the robot</p>
        </div>

      </div>
    </>
  );
};

export default Control;
