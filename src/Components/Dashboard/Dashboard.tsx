import TableRight from "./Table/TableRight";
import TableLeft from "./Table/TableLeft";
import SettingS from "./Settings/Settings";
import EventMode from "./EventMode/EventMode";
import Control from "./Control/Control";

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
      <div className="grid grid-cols-[1fr_400px] gap-2 h-full">
        <TableLeft />
        <TableRight />
      </div>
    );
  }
};
export default Dashboard;
