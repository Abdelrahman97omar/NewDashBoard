import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BatteryIcon from "./batteryIcon";
import { useEffect, useState, useRef } from "react";

const StatusBar = () => {
  const [opMode, setOpMode] = useState("");
  const [MotorMode, setMotorMode] = useState("");
  const [BatteryLevel, setBatteryLeve] = useState("");
  const [emergencyState, setEmergencyState] = useState("");
  const [localizationState, setlocalizationState] = useState("");
  const [manualAutoMode, setmanualAutoMode] = useState("");


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

      if (all_topic_state["emergency_state"]==="1"){setEmergencyState("pressed")}
      else {setEmergencyState("Released")}

      setlocalizationState(all_topic_state["localization_weight"])

      if (all_topic_state["manual-auto_mode"]==="1"){setmanualAutoMode("Manual")}
      else {setmanualAutoMode("Auto")}


      if(all_topic_state["voltage_sensor"]=="23" || all_topic_state["voltage_sensor"]=="22")
        {setBatteryLeve("High")}
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

      setlocalizationState(all_topic_state["localization_weight"])

      if (all_topic_state["manual-auto_mode"]==="1"){setmanualAutoMode("Manual")}
      else {setmanualAutoMode("Auto")}


      if(all_topic_state["voltage_sensor"]=="23" || all_topic_state["voltage_sensor"]=="22")
      {setBatteryLeve("High")}
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
        <div className="Cgray statusbarlayout">Battery: {BatteryLevel}</div>
        <div className="Cgray statusbarlayout">Motors: {MotorMode}</div>
        <div className="Cgray statusbarlayout">Emergency: {emergencyState}</div>
        <div className="Cgray statusbarlayout">N/A:N/A</div>
        <div className="Cgray statusbarlayout">Localization: {localizationState}</div>
        <div className="Cgray statusbarlayout">Mode: {manualAutoMode}</div>
        <div className="Cgray statusbarlayout">Operation Mode: {opMode}</div>
        <div className="Cgray statusbarlayout">N/A:N/A</div>
    </>
  );
};
export default StatusBar;
