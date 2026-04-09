import { useEffect, useState, useRef } from "react";
import { useRosConnection } from "../../../connection-provider";

const EventMode = () => {
  const { publishTopic, subscribeTopic } = useRosConnection();
  const [live_X, setLive_X] = useState("0");
  const [live_Y, setLive_Y] = useState("0");
  const [live_Seta, setLive_SETA] = useState("0");
  const [currentPointFile, setCurrentPointFile] = useState("");
  const [pointsFilessLists, setPointsFilessLists] = useState([]);

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
    setPointsFilessLists(data);
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
      <div className="border-2 h-full grid grid-rows-2">
        <div className="flex justify-between items-center">
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={appendPointHandler}
          >
            Append Point
          </button>
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={handleRemovePoint}
          >
            Delete Point List
          </button>
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={handleAddNewPoint}
          >
            Add New Point List
          </button>
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={handleclearPoint}
          >
            Clear Point List
          </button>
          <select
            className="Cgray w-[100px] text-center h-20 mr-20 rounded-2xl"
            onChange={(e) => setCurrentPointFile(e.target.value)}
          >
            {pointsFilessLists.map((pointNo) => (
              <option className="rounded-2xl" key={pointNo}>
                {pointNo}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-30">
          <button
            className="rounded-3xl w-full text-xl font-bold text-[#09203E] h-20 Cgray"
            onClick={setEventmodeButtonhandler}
          >
            Set Event Mode
          </button>
        </div>
      </div>
      <div className="border-2 mt-10">
        <header className="pl-5 border-2 text-4xl w-1/4  text-[#09203E] font-bold">
          Edit Points:
        </header>
        <div className=" grid grid-cols-3 h-full ">
          <div className=" h-full tableModeBorders">
            <p className="tablemodeHeaders">Live Points</p>
            <div className="XYSETA-VALUE-Position">
              <span className="font-bold text-xl mr-10">X:</span>
              <div className="tableModeNumberFieled">{live_X}</div>
            </div>
            <div className="XYSETA-VALUE-Position">
              <span className="font-bold text-xl mr-10">Y:</span>
              <div className="tableModeNumberFieled">{live_Y}</div>
            </div>
            <div className="XYSETA-VALUE-Position">
              <span className="font-bold text-xl mr-10">Theta:</span>
              <div className="tableModeNumberFieled">{live_Seta}</div>
            </div>
          </div>
          <div className="border-2 h-full overflow-hidden"></div>
          <div className="border-2 h-full overflow-hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default EventMode;
