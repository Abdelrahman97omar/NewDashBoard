import React from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useState } from "react";
import Dashboard from "./Components/Dashboard/Dashboard";
import StatusBar from "./Components/Statusbar/Statusbar";

const Layout = () => {
  const [dashboardPage, setDashboardPage] = useState(0);

  const getPageNumber = (value: string) => {
    switch (value) {
      case "Control":
        setDashboardPage(0);
        break;
      case "Settings":
        setDashboardPage(1);
        break;
      case "Event mode":
        setDashboardPage(2);
        break;
      case "Table Mode":
        setDashboardPage(3);
        break;
      case "Specialization":
        setDashboardPage(4);
        break;
      case "Information":
        setDashboardPage(5);
        break;
      case "Wifi Settings":
        setDashboardPage(6);
        break;
    }
  };
  return (
    <div className="Cgray w-screen h-screen p-4">
      <div className="grid grid-cols-[330px_1fr] h-full">

        <div className="grid grid-cols-1 h-[hv] px-3.5 py-10 Cblue rounded-4xl m-3">        
          <Sidebar returnNumber={getPageNumber} />
        </div>

        <div className="grid grid-rows-[250px_1fr]">

          <div className="bg-white grid grid-cols-4 gird-rows-2 rounded-4xl gap-5 pl-15 p-4 m-3 ">
              <StatusBar/>
          </div>

          <div className=" bg-white p-3 m-3 mb-12 rounded-4xl">
            <Dashboard page={dashboardPage} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Layout;
