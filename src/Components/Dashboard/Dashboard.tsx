import TableRight from "./Table/TableRight";
import TableLeft from "./Table/TableLeft";
import SettingS from "./Settings/Settings";
import EventMode from "./EventMode/EventMode";


const Dashboard = () => {
  const currentbutton = 1;

  //Table settings Mode
  if (currentbutton === 0) {
    return (
      <div className="grid grid-cols-[1fr_400px] gap-2 h-full">
        <TableLeft />
        <TableRight />
      </div>
    );
  }

    //Event Mode Button
    if (currentbutton === 1) {
      return (
        <EventMode />
      )
    }

  //Settings Button
  if (currentbutton === 2) {
    return (
      <SettingS />
    )
  }
};
export default Dashboard;
