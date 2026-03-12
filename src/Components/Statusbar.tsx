const StatusBar = () => {
  return (
    <>
      <div className="bg-white grid grid-cols-4 gird-rows-2 rounded-md  h-50 p-4 ml-2 shadow-md">
        <div className=" statusbarlayout">Battery</div>
        <div className=" statusbarlayout">Motors</div>
        <div className=" statusbarlayout">Emergency</div>
        <div className=" statusbarlayout"></div>
        <div className=" statusbarlayout">Localization</div>
        <div className=" statusbarlayout">Mode</div>
        <div className=" statusbarlayout">Operation Mode</div>
        <div className=" statusbarlayout"></div>
      </div>
    </>
  );
};
export default StatusBar;
