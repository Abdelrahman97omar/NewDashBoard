import React from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useState } from "react";
import Dashboard from "./Components/Dashboard/Dashboard";
import StatusBar from "./Components/Statusbar/Statusbar";
import logo from "./assets/LOGO.png"

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
    <div className="Cgray w-screen h-screen p-2 lg:p-4 overflow-hidden">
      <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[100px_1fr] lg:grid-cols-[330px_1fr] h-full gap-2 lg:gap-0">

        {/* ── Sidebar ── */}
        <div className="grid grid-cols-1 lg:px-3.5 py-4 lg:py-10 Cblue rounded-3xl lg:rounded-4xl m-0 lg:m-3">
          <div className="flex justify-center items-center mt-2 mb-4 lg:mt-5 lg:mb-20 lg:h-1/2">
            <img className="w-10 sm:w-14 lg:w-auto" src={logo} />
          </div>
          <Sidebar returnNumber={getPageNumber} />
        </div>

        {/* ── Main area ── */}
        <div className="grid grid-rows-1 lg:grid-rows-[250px_1fr] overflow-hidden gap-2 lg:gap-0">

          {/* Status bar – hidden on small screens */}
          <div className="hidden lg:flex gap-5 p-5 bg-white rounded-4xl">
            <StatusBar />
          </div>

          {/* Dashboard content */}
          <div className="bg-white p-3 m-0 lg:m-3 mb-2 lg:mb-12 rounded-3xl lg:rounded-4xl overflow-auto">
            <Dashboard page={dashboardPage} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Layout;
