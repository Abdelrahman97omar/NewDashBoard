import React from "react";
import Sidebar from "./Components/Sidebar/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {

  const printFuntion = (num: number) => {
    console.log(num);
  };

  return (
    <div className="bg-stone-200 w-screen h-screen p-4">

      <div className="grid grid-cols-[300px_1fr]  h-full">
      {/* Left top Corner */}
        <div className="bg-red-400 flex items-center justify-center rounded-md mr-2">
          Logo
        </div>
      {/* The status Bar */}
        <div className="bg-white grid grid-cols-4 gird-rows-2 rounded-md  h-50 p-4 ml-2 shadow-md">
          <div className=" border-1 flex justify-center items-center">Battery</div>
          <div className=" border-1 flex justify-center items-center">Motors</div>
          <div className=" border-1 flex justify-center items-center">Emergenyce</div>
          <div className=" border-1 flex justify-center items-center"></div>
          <div className=" border-1 flex justify-center items-center">Localization</div>
          <div className=" border-1 flex justify-center items-center">Mode</div>
          <div className=" border-1 flex justify-center items-center">Operation Mode</div>
          <div className=" border-1 flex justify-center items-center"></div>
        </div>

        {/* The SideBar */}
        <Sidebar getPageNumber={printFuntion} />

        <div className="bg-gray-400 rounded-r-md p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;

