import { useEffect, useState } from "react";
import { useRosConnection } from "../../../connection-provider";
import {
  getEventpointsList,
  handleclearPoint,
  getpointsPool,
  addNewPoint,
  handleEditPoint,
  removePoint,
} from "./eventAPI";

const EventMode = () => {
  const { publishTopic, subscribeTopic, unsubscribeTopic } = useRosConnection();
  const [live_X, setLive_X] = useState("0");
  const [live_Y, setLive_Y] = useState("0");
  const [live_Seta, setLive_SETA] = useState("0");
  const [pointsFilessLists, setPointsFilessLists] = useState([]);
  const [currentPointFile, setCurrentPointFile] = useState("");
  const [pointsPoollList, setPointsPoollList] = useState<string[]>([]);
  const [choosenpointsPool, setChoosenPointsPool] = useState(0);
  const [pointValues, setPointValues] = useState<string[][]>([]);
  const [manualPoint_X, setManualPoint_X] = useState("0");
  const [manualPoint_Y, setManualPoint_Y] = useState("0");
  const [manualPoint_SETA, setManualPoint_SETA] = useState("0");

  const init = async () => {
    const data = await getEventpointsList();
    setPointsFilessLists(data);
    setCurrentPointFile(data[0]);
    const x = await getpointsPool(data[0]);
    if (!x || Object.keys(x).length === 0) {
      console.log("Empty or invalid response");
    } else {
      setPointsPoollList(Object.keys(x));
      setPointValues(Object.values(x));
    }
  };

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
    const X = Number(message.pose.pose.position.x).toFixed(2);
    const Y = Number(message.pose.pose.position.y).toFixed(2);
    const Seta = Number(yawDeg).toFixed(2);
    setLive_X(X);
    setLive_Y(Y);
    setLive_SETA(Seta);
  };

  useEffect(() => {
    init();
    subscribeTopic(
      "/slamware_ros_sdk_server_node/odom",
      "nav_msgs/Odometry",
      (msg) => livePointsUpdate(msg)
    );
    return () => {
      unsubscribeTopic("/slamware_ros_sdk_server_node/odom");
    };
  }, []);

  const setEventmodeButtonhandler = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 1,
    });
  };

  const ChooseNewFileNumberhandle = async (e: any) => {
    const x = await getpointsPool(e.target.value);
    if (!x || Object.keys(x).length === 0) {
      setPointValues([["0", "0", "0"]]);
      setPointsPoollList(["0"]);
      setChoosenPointsPool(0);
      console.log("Empty or invalid response");
    } else {
      setPointValues(Object.values(x));
      setPointsPoollList(Object.keys(x));
    }
    setCurrentPointFile(e.target.value);
  };

  const ChooseNewPointsPoolHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setChoosenPointsPool(Number(e.target.value));
    console.log(Number(e.target.value));
    console.log("The values are", pointValues);
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

  const handleRemovePoint = async () => {
    await removePoint(currentPointFile);
    const data = await getEventpointsList();
    setPointsFilessLists(data);
    setCurrentPointFile(data[0]);
  };
  const handleAddNewPoint = async () => {
    await addNewPoint();
    const data = await getEventpointsList();
    setPointsFilessLists(data);
    setCurrentPointFile(data[0]);
  };

  const blursetManualPoint_X = () => {
    if (manualPoint_X === "0") {
      setManualPoint_X("0");
    } else return;
  };
  const blursetManualPoint_Y = () => {
    if (manualPoint_Y === "0") {
      setManualPoint_Y("0");
    } else return;
  };
  const blursetManualPoint_SETA = () => {
    if (manualPoint_SETA === "0") {
      setManualPoint_SETA("0");
    } else return;
  };

  const ClicksetManualPoint_X = () => {
    if (manualPoint_X === "0") {
      setManualPoint_X("");
    } else return;
  };
  const ClicksetManualPoint_Y = () => {
    if (manualPoint_Y === "0") {
      setManualPoint_Y("");
    } else return;
  };
  const ClicksetManualPoint_SETA = () => {
    if (manualPoint_SETA === "0") {
      setManualPoint_SETA("");
    } else return;
  };

  return (
    <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
      <div className=" h-full grid grid-rows-2">
        <div className="flex justify-between items-center">
          <button className="eventModeButtons" onClick={appendPointHandler}>
            Append Point
          </button>
          <button className="eventModeButtons" onClick={handleRemovePoint}>
            Delete Point List
          </button>
          <button className="eventModeButtons" onClick={handleAddNewPoint}>
            Add New Point List
          </button>
          <button
            className="eventModeButtons"
            onClick={() => {
              handleclearPoint(currentPointFile);
            }}
          >
            Clear Point List
          </button>
          <select
            className="shadow-lg shadow-black/50 Corange w-25 text-center h-20 mr-20 rounded-2xl"
            onChange={ChooseNewFileNumberhandle}
          >
            {pointsFilessLists.map((pointNo) => (
              <option className="rounded-2xl Cgray" key={pointNo}>
                {pointNo}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-50 mt-8">
          <button
            className="border shadow-md shadow-black/50 rounded-3xl w-full text-xl font-bold text-[#09203E] h-20 Cgray transition
                        duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
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
              <select
                className="Cgray w-1/2 h-10 text-center rounded-3xl"
                onChange={ChooseNewPointsPoolHandler}
              >
                {pointsPoollList.map((x, index) => (
                  <option key={x} value={index}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className=" mt-4">
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">X:</span>
                <div className="tableModeNumberFieled">
                  {pointValues[choosenpointsPool]
                    ? pointValues[choosenpointsPool][0]
                    : "N/A"}
                </div>
              </div>
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">Y:</span>
                <div className="tableModeNumberFieled">
                  {pointValues[choosenpointsPool]
                    ? pointValues[choosenpointsPool][1]
                    : "N/A"}
                </div>
              </div>
              <div className="XYSETA-VALUE-Position">
                <span className="font-bold text-xl mr-10">Theta:</span>
                <div className="tableModeNumberFieled">
                  {pointValues[choosenpointsPool]
                    ? pointValues[choosenpointsPool][2]
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full tableModeBorders">
            <p className="tablemodeHeaders">Edit Point</p>
            <button
              className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-9 Cgray mx-20 border shadow-md shadow-black/50 transition
                        duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
              onClick={() =>
                handleEditPoint(
                  currentPointFile,
                  choosenpointsPool,
                  live_X,
                  live_Y,
                  live_Seta
                )
              }
            >
              Set Live Points
            </button>
            <button
              className="rounded-3xl w-60 text-xl font-bold text-[#09203E] h-9 Cgray mt-3 mx-20 border shadow-md shadow-black/50 transition
                        duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
              onClick={() =>
                handleEditPoint(
                  currentPointFile,
                  choosenpointsPool,
                  manualPoint_X,
                  manualPoint_Y,
                  manualPoint_SETA
                )
              }
            >
              Set Manuall
            </button>
            <div className="flex justify-between items-center mt-6 px-3">
              <span className="font-bold text-xl">X:</span>
              <input
                className="tableModeNumberFieled"
                value={manualPoint_X}
                onBlur={blursetManualPoint_X}
                onFocus={ClicksetManualPoint_X}
                onChange={(e) => setManualPoint_X(e.target.value)}
              />
              <span className="font-bold text-xl ">Y:</span>
              <input
                className="tableModeNumberFieled"
                value={manualPoint_Y}
                onBlur={blursetManualPoint_Y}
                onFocus={ClicksetManualPoint_Y}
                onChange={(e) => setManualPoint_Y(e.target.value)}
              />
              <span className="font-bold text-xl ">Seta:</span>
              <input
                className="tableModeNumberFieled"
                value={manualPoint_SETA}
                onBlur={blursetManualPoint_SETA}
                onFocus={ClicksetManualPoint_SETA}
                onChange={(e) => setManualPoint_SETA(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMode;
