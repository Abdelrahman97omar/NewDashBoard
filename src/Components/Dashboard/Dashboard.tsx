// import TableRight from "./Table/TableRight";
// import TableLeft from "./Table/TableLeft";
import Table from "./Table/Table";
import SettingS from "./Settings/Settings";
import EventMode from "./EventMode/EventMode";
import Control from "./Control/Control";
import WifiSettings from "./wifiSettings/wifiSettings"

type MyProp = {
  page: number;
};

const Dashboard = ({ page }: MyProp) => {

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
    return <EventMode />;
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
