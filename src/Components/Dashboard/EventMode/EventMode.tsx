import { useEffect, useState, useRef } from "react";
import { useRosConnection } from "../../../connection-provider";

const EventMode = () => {
  const { publishTopic,subscribeTopic } = useRosConnection();
  const [live_X, setLive_X] = useState("0");
  const [live_Y, setLive_Y] = useState("0");
  const [liveSeta, setLive_SETA] = useState("0");
  const [currentPointFile, setCurrentPointFile] = useState("0.0");
  const [pointsLists, setPointsLists] = useState([]);


  const typer=(message:any)=>{
    const yaw = Math.atan2(
      2 * (message.pose.pose.orientation.w * message.pose.pose.orientation.z + message.pose.pose.orientation.x * message.pose.pose.orientation.y),
      1 - 2 * (message.pose.pose.orientation.y * message.pose.pose.orientation.y +message.pose.pose.orientation.z * message.pose.pose.orientation.z)
    );
    const yawDeg :any = yaw * (180 / Math.PI);
    setLive_X(Number((message.pose.pose.position.x)).toFixed(2))
    setLive_Y(Number((message.pose.pose.position.y)).toFixed(2))
    setLive_SETA((Number(yawDeg)).toFixed(2))
  }
  subscribeTopic(
    "/slamware_ros_sdk_server_node/odom",
    "nav_msgs/Odometry",
    (message: any) => typer(message)
  );


  const setEventmodeButtonhandler = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 1,
    });
  };

  const appendPointHandler=()=>{
    console.log(parseFloat(currentPointFile))
    publishTopic("/points_no", "std_msgs/Float32", {
      data: parseFloat(currentPointFile)
    });

    publishTopic("/append", "std_msgs/Bool", {
      data: true,
    });


  }

  const getEventpointsList=async ()=>{
    const res= await fetch(`http://${window.location.hostname}:8001/eventMode/getAllPoints`)
    const data= await res.json()
    setPointsLists(data)
    // console.log(data)
  }

  useEffect(()=>{
    getEventpointsList()
  },[])

  const handleAddNewPoint=async()=>{
   const res=  await fetch(`http://${window.location.hostname}:8001/eventMode/addNewPoint`,
      {
        method:"PUT",
      }
    )
    const data = res.json()
    console.log(data)
    getEventpointsList()
  }

  const handleRemovePoint= async()=>{
    await fetch(`http://${window.location.hostname}:8001/eventMode/deletePoint/${currentPointFile}`,{
      method:"DELETE"
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
        <div className="border-2 border-green-500 h-full flex justify-around items-center">
          <button className="rounded-lg Cgray h-[50px] w-[200px]" onClick={appendPointHandler}>
            Append Point
          </button>
          <button className="rounded-lg Cgray h-[50px] w-[200px]" onClick={handleRemovePoint}>
            Delete Points
          </button>
          <button className="rounded-lg Cgray h-[50px] w-[200px]" onClick={handleAddNewPoint}>
            Add New Point
          </button>
          <select className="Cgray w-[300px] text-center h-[50px] rounded-2xl"
          onChange={(e) =>setCurrentPointFile(e.target.value)}>
            {pointsLists.map((pointNo) => (
              <option className="rounded-2xl" key={pointNo}>{pointNo}</option>
            ))}
          </select>
        </div>
        <div className="border border-amber-900 h-full flex justify-center items-center">
          <button className="border-3 border-gray-500 rounded-3xl w-200 h-50 bg-amber-700" onClick={setEventmodeButtonhandler}> Set Event Mode</button>
        </div>
      </div>
    </>
  );
};

export default EventMode;
