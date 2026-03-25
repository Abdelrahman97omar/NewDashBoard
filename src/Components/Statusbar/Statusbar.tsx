import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BatteryIcon from "./batteryIcon";
import { useEffect, useState, useRef } from "react";

const StatusBar = () => {
  const [opMode, setOpMode] = useState("");
  const [MotorMode, setMotorMode] = useState("");
  const [BatteryLevel, setBatteryLeve] = useState("");
  const [emergencyState, setEmergencyState] = useState("");


  useEffect(() => {
    const get_current_states = async () => {
      const resp = await fetch("http://127.0.0.1:8001/stausBar/States", { method: "GET" });
      // const resp = await fetch(`http://${window.location.hostname}:8001/stausBar/States`)
      const data = await resp.json();
      const all_topic_state = JSON.parse(data) // All topic values are now object

      if (all_topic_state["op_mode"] === "1") { setOpMode("Event"); }
      else { setOpMode("Table"); }

      if (all_topic_state["enable_motors"] == "True") { setMotorMode("ON") }
      else { setMotorMode("OFF") }

      if(all_topic_state["voltage_sensor"]=="23" || all_topic_state["voltage_sensor"]=="22")
        {setBatteryLeve("HHHigh")}
        else if(all_topic_state["voltage_sensor"]=="21" || all_topic_state["voltage_sensor"]=="20")
        {setBatteryLeve("Meduim")}
        else{setBatteryLeve("Low")}
    };
    get_current_states();
  }, []);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:9876");
    // ws.current = new WebSocket(`ws://${window.location.hostname}:9876`)
    ws.current.onopen = () => { console.log("Connected!"); };

    ws.current.onmessage = (msg) => {
      const all_topic_state = JSON.parse(msg.data)
      console.log("From statusbar, ws recived", all_topic_state, "of type", typeof (all_topic_state))

      if (all_topic_state["op_mode"] === "1") { setOpMode("Event"); }
      else { setOpMode("Table"); }

      if (all_topic_state["enable_motors"] == "True") { setMotorMode("ON") }
      else { setMotorMode("OFF") }

      if (all_topic_state["emergency_state"]==="1"){setEmergencyState("pressed")}
      else {setEmergencyState("Released")}

      if(all_topic_state["voltage_sensor"]=="23" || all_topic_state["voltage_sensor"]=="22")
      {setBatteryLeve("HHHigh")}
      else if(all_topic_state["voltage_sensor"]=="21" || all_topic_state["voltage_sensor"]=="20")
      {setBatteryLeve("Meduim")}
      else{setBatteryLeve("Low")}
      };
    return () => {
      ws.current?.close();
    };
  }, []);



  return (
    <>
      <div className="bg-white grid grid-cols-4 gird-rows-2 rounded-md  h-50 p-4 ml-2 shadow-md">
        {/* statusbarlayout */}
        <div className=" border grid grid-cols-1 grid-rows-2">
          <div className="mt-7 flex justify-center">
            <BatteryIcon batteryType="High" />
          </div>
          <div className=" flex justify-center gap-2">
            <p className="font-bold">Battery:</p>
            <p className="text-green-400">{BatteryLevel}</p>
          </div>
        </div>

        {/* <div className=' h-3 w-5 m-4' ><BatteryChargingFullIcon/></div>
          <div> Battery:<p className='font-bold text-green-400'>High</p></div>
          </div> */}
        <div className=" statusbarlayout">Motors: {MotorMode}<DirectionsCarIcon /></div>
        <div className=" statusbarlayout">Emergency: {emergencyState}</div>

        <div className=" statusbarlayout"> battery={BatteryLevel}</div>

        <div className=" statusbarlayout">Localization</div>
        <div className=" statusbarlayout">Mode: </div>
        <div className=" statusbarlayout">Operation Mode: {opMode}</div>
        <div className=" statusbarlayout"></div>
      </div>
    </>
  );
};
export default StatusBar;
