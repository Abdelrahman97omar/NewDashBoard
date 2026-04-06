import { useEffect, useState, useRef } from "react";
import { useRosConnection } from "../../../connection-provider";

const EventMode = () => {
  const { publishTopic, subscribeTopic } = useRosConnection();
  const [live_X, setLive_X] = useState("0");
  const [live_Y, setLive_Y] = useState("0");
  const [liveSeta, setLive_SETA] = useState("0");
  const [currentPointFile, setCurrentPointFile] = useState("");
  const [pointsLists, setPointsLists] = useState([]);

  const livePointsUpdate = (message: any) => {
    const yaw = Math.atan2(
      2 *
        (message.pose.pose.orientation.w * message.pose.pose.orientation.z +
          message.pose.pose.orientation.x * message.pose.pose.orientation.y),
      1 -
        2 *
          (message.pose.pose.orientation.y * message.pose.pose.orientation.y +
            message.pose.pose.orientation.z * message.pose.pose.orientation.z)
    );
    const yawDeg: any = yaw * (180 / Math.PI);
    setLive_X(Number(message.pose.pose.position.x).toFixed(2));
    setLive_Y(Number(message.pose.pose.position.y).toFixed(2));
    setLive_SETA(Number(yawDeg).toFixed(2));
  };
  subscribeTopic(
    "/slamware_ros_sdk_server_node/odom",
    "nav_msgs/Odometry",
    (message: any) => livePointsUpdate(message)
  );

  const setEventmodeButtonhandler = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 1,
    });
  };

  const appendPointHandler = () => {
    console.log(parseFloat(currentPointFile));
    publishTopic("/points_no", "std_msgs/Float32", {
      data: parseFloat(currentPointFile),
    });

    publishTopic("/append", "std_msgs/Bool", {
      data: true,
    });
  };

  const getEventpointsList = async () => {
    const res = await fetch(
      `http://${window.location.hostname}:8001/eventMode/getAllPoints`
    );
    const data = await res.json();
    setPointsLists(data);
    console.log(data);
    console.log("The first point in teh list is:", data[0]);
    setCurrentPointFile(data[0]);
  };

  useEffect(() => {
    getEventpointsList();
  }, []);

  const handleAddNewPoint = async () => {
    const res = await fetch(
      `http://${window.location.hostname}:8001/eventMode/addNewPoint`,
      {
        method: "PUT",
      }
    );
    getEventpointsList();
  };

  const handleRemovePoint = async () => {
    console.log("the currnet files are", currentPointFile);
    await fetch(
      `http://${window.location.hostname}:8001/eventMode/deletePoint/${currentPointFile}`,
      {
        method: "DELETE",
      }
    );
    getEventpointsList();
  };
  const handleclearPoint = async () => {
    await fetch(
      `http://${window.location.hostname}:8001/eventMode/clearPoint/${currentPointFile}`,
      {
        method: "PATCH",
      }
    );
  };

  return (
    <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
      <div className="border-2 border-green-500 h-full grid grid-cols-3">

        <div >
          <button
            className="rounded-3xl w-50 h-20 Cgray m-2"
            onClick={appendPointHandler}
          >
            Append Point
          </button>
          <button
            className="rounded-3xl w-50 h-20 Cgray m-2"
            onClick={handleRemovePoint}
          >
            Delete Point
          </button>
          <button
            className="rounded-3xl w-50 h-20 Cgray m-2"
            onClick={handleAddNewPoint}
          >
            Add New Point List
          </button>
          <button
            className="rounded-3xl w-50 h-20 Cgray m-2"
            onClick={handleclearPoint}
          >
            Clear Point List
          </button>
        </div>

        <div>
          <button
            className="rounded-3xl w-50 h-20 Cgray"
            onClick={setEventmodeButtonhandler}
          >
            Set Event Mode
          </button>
        </div>

        <div>
          <select
            className="Cgray w-[300px] text-center h-[50px] rounded-2xl"
            onChange={(e) => setCurrentPointFile(e.target.value)}
          >
            {pointsLists.map((pointNo) => (
              <option className="rounded-2xl" key={pointNo}>
                {pointNo}
              </option>
            ))}
          </select>
        </div>
        
      </div>
    </div>
  );
};

export default EventMode;
