// import TableRight from "./Table/TableRight";
// import TableLeft from "./Table/TableLeft";
import Table from "./Table/Table";
import SettingS from "./Settings/Settings";
import EventMode from "./EventMode/EventMode";
import Control from "./Control/Control";
import WifiSettings from "./wifiSettings/wifiSettings";
import { useEffect, useState } from "react";
import { useRosConnection } from "../../connection-provider";

type MyProp = {
  page: number;
};

const Dashboard = ({ page }: MyProp) => {
  const [alive_X, setLive_X] = useState("0");
  const [alive_Y, setLive_Y] = useState("0");
  const [alive_Seta, setLive_SETA] = useState("0");
  const { subscribeTopic , unsubscribeTopic} = useRosConnection();




    useEffect(() => {
      console.log(alive_X, alive_Y, alive_Seta);
    }, [alive_X, alive_Y, alive_Seta]);

  useEffect(() => {
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
      console.log(alive_X);
      console.log(alive_Y);
      console.log(alive_Seta);
    };
    subscribeTopic(
      "/slamware_ros_sdk_server_node/odom",
      "nav_msgs/Odometry",
      livePointsUpdate
    );
    return unsubscribeTopic("/slamware_ros_sdk_server_node/odom")
  }, []);
  //Control Button
  if (page === 0) {
    return <Control />;
  }
  //Settings Button
  if (page === 1) {
    return <SettingS />;
  }
  //Event Mode Button
  if (page === 2) {
    return (
      <EventMode live_X={alive_X} live_Y={alive_Y} live_Seta={alive_Seta} />
    );
  }
  //Table settings Mode
  if (page === 3) {
    return (
      <div>
        <Table />
      </div>
    );
  }
  // if (page === 4) {
  //   return (
  //     <div >
  //     </div>
  //   );
  // }

  // if (page === 5) {
  //   return (
  //     <div >
  //     </div>
  // );

  if (page === 6) {
    return (
      <div>
        <WifiSettings />
      </div>
    );
  }
};
export default Dashboard;
