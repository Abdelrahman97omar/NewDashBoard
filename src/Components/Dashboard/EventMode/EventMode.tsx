import { useEffect, useState, useRef } from "react";
import { useRosConnection } from "../../../connection-provider";
import {
  getEventpointsList,
  handleclearPoint,
  getpointsPool,
  handleAddNewPoint,
  handleRemovePoint,
} from "./eventAPI"

const EventMode = () => {
  const { publishTopic, subscribeTopic } = useRosConnection();
  const [live_X, setLive_X] = useState("0");
  const [live_Y, setLive_Y] = useState("0");
  const [live_Seta, setLive_SETA] = useState("0");
  const [currentPointFile, setCurrentPointFile] = useState("");
  const [pointsPooll, setPointsPooll] = useState<string[]>([]);
  const [pointsFilessLists, setPointsFilessLists] = useState([]);
  const [fetched_Point_x, setFetched_Point_x] = useState();
  const [fetched_Point_y, setFetched_Point_y] = useState();
  const [fetched_Point_seta, setFetched_Point_seta] = useState();

  useEffect(() => {
    const init = async () => {
      const data = await getEventpointsList();
      setPointsFilessLists(data);
      setCurrentPointFile(data[0]);
    };
    init();
    subscribeTopic(
      "/slamware_ros_sdk_server_node/odom",
      "nav_msgs/Odometry",
      (msg) => livePointsUpdate(msg)
    );
  }, []);

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
    console.log(live_X);
    console.log(live_Y);
    console.log(live_Seta);
  };

  const setEventmodeButtonhandler = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 1,
    });
  };

  const handleChooseNewFileNumber = async (e: any) => {
    const x = await getpointsPool(e.target.value);
    const list_of_points=Object.keys(x)
    const pointValues=Object.values(x)
    console.log(pointValues)
    setPointsPooll(list_of_points);
    setCurrentPointFile(e.target.value);
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

  return (
    <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
      <div className=" h-full grid grid-rows-2">
        <div className="flex justify-between items-center">
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={appendPointHandler}
          >
            Append Point
          </button>
          <button
            className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-20 Cgray m-2"
            onClick={()=>{handleRemovePoint(currentPointFile)}}
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
            onClick={() => { handleclearPoint(currentPointFile); }}
          >
            Clear Point List
          </button>
          <select
            className="Cgray w-[100px] text-center h-20 mr-20 rounded-2xl"
            onChange={handleChooseNewFileNumber}
          >
            {pointsFilessLists.map((pointNo) => (
              <option className="rounded-2xl" key={pointNo}>
                {pointNo}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-30 mt-5">
          <button
            className="rounded-3xl w-full text-xl font-bold text-[#09203E] h-20 Cgray"
            onClick={setEventmodeButtonhandler}
          >
            Set Event Mode
          </button>
        </div>
      </div>
      <div className="mt-7">
        <header className="pl-5 mb-10 text-4xl w-1/4  text-[#09203E] font-bold">
          Edit Points:
        </header>

        <div className=" grid grid-cols-3  gap-4 px-20">
          <div className=" tableModeBorders">
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

          <div className="h-full tableModeBorders">
            <p className="tablemodeHeaders">Points Pool</p>
            <div className="flex justify-center items-center">
              <select className="Cgray w-1/2 h-10 text-center rounded-3xl">
                {pointsPooll.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className=" mt-4">
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">X:</span>
                <div className="tableModeNumberFieled">N/a</div>
              </div>
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">Y:</span>
                <div className="tableModeNumberFieled">N/A</div>
              </div>
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">Theta:</span>
                <div className="tableModeNumberFieled">N/A</div>
              </div>
            </div>
          </div>

          <div className="h-full tableModeBorders">
            <p className="tablemodeHeaders">Edit Point</p>
            <button className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-9 Cgray mx-20">
              Set Live Points
            </button>
            <button className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-9 Cgray mt-3 mx-20">
              Set Manuall
            </button>
            <div className="flex justify-between items-center mt-6 px-3">
              <p className="text-[#09203E] text-l font-bold">X:</p>
              <input className="border-2 w-1/4" type=""></input>
              <p className="text-[#09203E] text-l font-bold">Y:</p>
              <input className="border-2 w-1/4" type=""></input>
              <p className="text-[#09203E] text-l font-bold">Seta:</p>
              <input className="border-2 w-1/4" type=""></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMode;
