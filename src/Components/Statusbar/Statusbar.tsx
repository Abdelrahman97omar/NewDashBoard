import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BatteryIcon from "./batteryIcon";
import { useEffect, useState,useRef } from "react";

const StatusBar = () => {
  const [opMode, setOpMode] = useState("");

  useEffect(() => {
    const Get_op_state = async () => {
      const resp = await fetch("http://127.0.0.1:8001/stausBar/SetEventbutton",{ method: "GET" });
      const data = await resp.json();
      if (data["The_state_is"] === "1") {
        setOpMode("Event");
      } else {
        setOpMode("Table");
      }
    };
    Get_op_state();
  }, []);

  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:9876");
    ws.current.onopen = () => {console.log("Connected!");};

    ws.current.onmessage = (msg) => {
      if (msg.data === "1")
        {setOpMode("Event");}
      else {setOpMode("Table");}
    };
    return () => {
      ws.current?.close();
    };
  }, []);



  return (
    <>
      <div className="bg-white grid grid-cols-4 gird-rows-2 rounded-md  h-50 p-4 ml-2 shadow-md">
        {/* statusbarlayout */}
        <div className=" border-1 grid grid-cols-1 grid-rows-2">
          <div className="mt-7 flex justify-center">
            <BatteryIcon batteryType="High" />
          </div>
          <div className=" flex justify-center gap-2">
            <p className="font-bold">Battery:</p>
            <p className="text-green-400">High</p>
          </div>
        </div>

        {/* <div className=' h-3 w-5 m-4' ><BatteryChargingFullIcon/></div>
          <div> Battery:<p className='font-bold text-green-400'>High</p></div>
          </div> */}
        <div className=" statusbarlayout">
          Motors: <DirectionsCarIcon />
        </div>
        <div className=" statusbarlayout">Emergency</div>
        <div className=" statusbarlayout">
          <BatteryIcon batteryType="High" />
        </div>
        <div className=" statusbarlayout">Localization</div>
        <div className=" statusbarlayout">Mode: {opMode}</div>
        <div className=" statusbarlayout">Operation Mode</div>
        <div className=" statusbarlayout"></div>
      </div>
    </>
  );
};
export default StatusBar;
