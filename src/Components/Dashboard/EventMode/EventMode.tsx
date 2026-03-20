import { useEffect, useState, useRef } from "react";
import { useRosConnection } from "../../../connection-provider";

const EventMode = () => {
  const PointList = [1, 2, 3, 4, 5, 6];
  const { publishTopic } = useRosConnection();


  // const wsRef = useRef<WebSocket | null>(null);
  // useEffect(() => {
  //   wsRef.current = new WebSocket('ws://localhost:9876');
  //   wsRef.current.onopen = () => console.log("WebSocket connected in EventMode");
  //   wsRef.current.onclose = () => console.log("WebSocket disconnected in EventMode");

  //   return () => {
  //     wsRef.current?.close();
  //   };
  // }, []);

  const eventmodeButtonhandler = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 1,
    });

    // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    //   console.log("from Event mode. sending websocket of value",nextMode)
    //   wsRef.current.send(String(nextMode));
    // } else {
    //   console.warn("WebSocket not connected, could not send message");
    // }
  };


  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
        <div className="border-2 border-green-500 h-full flex justify-around items-center">
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Append Point
          </button>
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Delete Points
          </button>
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Add New Point
          </button>
          <select className="border-1 bg-blue-600 w-[300px] h-[50px] pl-[140px] rounded-2xl">
            {PointList.map((pointNo) => (
              <option className="rounded-2xl" key={pointNo}>{pointNo}</option>
            ))}
          </select>
        </div>
        <div className="border border-amber-900 h-full flex justify-center items-center">
          <button className="border-3 border-gray-500 rounded-3xl w-200 h-50 bg-amber-700" onClick={eventmodeButtonhandler}> Set Event Mode</button>
        </div>
      </div>
    </>
  );
};

export default EventMode;
