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
    <div className="bg-stone-200 w-screen h-screen p-4">
      <div className="grid grid-cols-[300px_1fr]  h-full">
        {/* Left top Corner */}
        <div className="bg-red-400 flex items-center justify-center rounded-md mr-2">
          Logo
        </div>
        {/* The status Bar */}
        <StatusBar />
        {/* The SideBar */}
        <Sidebar returnNumber={getPageNumber} />
        <div className="bg-gray-400 rounded-r-md p-4">
          {/* {children(dashboardPage)} */}
          <Dashboard page={dashboardPage} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
