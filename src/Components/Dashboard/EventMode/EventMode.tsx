const EventMode = () => {
  const PointList = [1, 2, 3, 4, 5, 6];
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[200px_1fr] h-full border-amber-50">
        <div className="border-2 border-green-500 h-full flex justify-around items-center">
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Append Point
          </button>
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Delete Points
          </button>
          <button className="rounded-lg bg-fuchsia-500 border-2 border-fuchsia-900 h-[50px] w-[200px]">
            Delete Points
          </button> 
            <select className="border-1 bg-blue-600 w-[300px] h-[50px] pl-[140px] rounded-2xl">
                {PointList.map((pointNo) => (
                <option className="rounded-2xl" key={pointNo}>{pointNo}</option>
                ))}
            </select>
        </div>
        <div className="border border-amber-900 h-full flex justify-center items-center">
          <button className="border-3 border-gray-500 rounded-3xl w-200 h-50 bg-amber-700"> Set Event Mode</button>
        </div>
      </div>
    </>
  );
};

export default EventMode;
