import type { Numbers } from "@mui/icons-material";
import { useRosConnection } from "../../../connection-provider";
import { useEffect, useState } from "react";
const TableLeft = () => {
  const [manualPoint_X,setManualPoint_X] = useState("0");;
  const [manualPoint_Y,setManualPoint_Y] = useState("0");;
  const [manualPoint_SETA,setManualPoint_SETA] = useState("0");
  const [tableList, setTableList] = useState([]);
  const [selectedTable, setselectedTable] = useState(0);

  const { publishTopic } = useRosConnection();

  const fetchTables = async () => {
    const res = await fetch("http://${window.location.hostname}:8001/tablemode/gettable", {
      method: "GET",
    });
    const data = JSON.parse(await res.json());
    setTableList(data);
    console.log("Table list:", data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const getSelectedTableFromList = (tableNumber: number) => {
    setselectedTable(tableNumber);
    console.log("Selected tabele number is:", tableNumber);
  };

  const handleSetTableMode = () => {
    publishTopic("/op_mode", "std_msgs/Int32", {
      data: 0,
    });
  };

  const handleAddNewTable = () => {
    const addNewTable = async () => {
      const res = await fetch("http://${window.location.hostname}:8001/tablemode/addnewtable", {
        method: "PUT",
      });
    };

    addNewTable();
    fetchTables();
  };

  const handleDeleteTable=()=>{
    const removeLastTable = async () => {
    const res = await fetch("http://${window.location.hostname}:8001/tablemode/removetable", {
      method: "DELETE",
    });
    };

    removeLastTable();
    fetchTables();
  }

  const handleGoToTable=()=>{
    const tableNumber_float=(selectedTable).toFixed(1)
    console.log("publishing..",tableNumber_float)
    publishTopic("/table_no", "std_msgs/Float32", {
      data: tableNumber_float,
    });
  }
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[200px_1fr] border-2">
        <div className="grid grid-cols-[500px_1fr] border-amber-600 border-2">
          <div className="bg-green-400 grid grid-cols-1 grid-rows-2">
            <div className="flex justify-center items-center">
              <button
                className="border-2 font-bold text-3xl mx-2 w-[300px] h-[90px] rounded-xl bg-orange-500"
                onClick={handleAddNewTable}
              >
                Add New Table
              </button>
              <button className="border-2 font-bold text-3xl mx-2 w-[300px] h-[90px] rounded-xl bg-orange-500"
              onClick={handleDeleteTable}>
                Remove Last Table
              </button>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="border-2 font-bold text-3xl mx-2 w-[300px] h-[90px] rounded-xl bg-orange-500"
                onClick={handleSetTableMode}
              >
                Set Table Mode
              </button>
              <button className="border-2 font-bold text-3xl mx-2 w-[300px] h-[90px] rounded-xl bg-orange-500"
              onClick={handleGoToTable}>
                Go to Table
              </button>
            </div>
          </div>

          <div className="bg-green-800 flex justify-center items-center">
            <select
              className="border-2 bg-blue-300 w-[300px] rounded-4xl h-25 pl-29"
              name="cars"
              id="cars"
              value={selectedTable}
              onChange={(e) => getSelectedTableFromList(Number(e.target.value))}
            >
              {tableList.map((no) => (
                <option value={no} key={no}>
                  Table {no}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------------------------------------------- */}
        <div className="border-amber-400 border-2 flex justify-center items-start">
          <div className="border-2 w-1/2 h-full">
            <p className="bg-gray-600 rounded-lg p-2 text-3xl font-bold w-1/2 ml-[120px] pl-[30px] mt-4">
              Live Points
            </p>

            <div className="flex items-center gap-8 px-10 m-9">
              <span className="font-bold text-xl mr-10">X:</span>
              <div className="w-20 h-7 border rounded-md bg-white flex items-center justify-center">
                0
              </div>
            </div>
            <div className="flex items-center gap-8 px-10 m-9">
              <span className="font-bold text-xl mr-10">Y:</span>
              <div className="w-20 h-7 border rounded-md bg-white flex items-center justify-center">
                0
              </div>
            </div>
            <div className="flex items-center gap-3 px-10 m-4">
              <span className="font-bold text-xl mr-10">Theta:</span>
              <div className="w-20 h-7 border rounded-md bg-white flex items-center justify-center">
                0
              </div>
            </div>
            <div className="flex justify-center">
              <button className="border-2 p-2 mt-6 rounded-lg">
                Set Main Table
              </button>
            </div>
            <div className="flex justify-center items-center ">
              <button className="border-2 mt-6 m-4 p-2 rounded-lg">
                Set backup 1
              </button>
              <button className="border-2 m-4 mt-6 p-2 rounded-lg">
                Set backup 2
              </button>
              <button className="border-2 m-4 mt-6 p-2 rounded-lg">
                Set backup 3
              </button>
            </div>
          </div>

          <div className="relative border-2 w-1/2 h-full">
            <p className="bg-gray-600 rounded-lg p-2 text-3xl font-bold w-[250px] ml-[105px] pl-[20px] mt-4">
              Manual Points
            </p>
            <div className="flex items-center gap-8 px-10 m-9">
                <span className="font-bold text-xl mr-10">X:</span>
                <input className="w-20 h-7 border rounded-md bg-white text-center"
                value={manualPoint_X}  onChange={e => setManualPoint_X(e.target.value)} />
            </div>
            <div className="flex items-center gap-8 px-10 m-9 ">
              <span className="font-bold text-xl mr-10">Y:</span>
              <input className="w-20 h-7 border rounded-md bg-white text-center"
                value={manualPoint_Y}  onChange={e => setManualPoint_Y(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 px-10 m-4 ">
              <span className="font-bold text-xl mr-10">Theta:</span>
              <input className="w-20 h-7 border rounded-md bg-white text-center"
                value={manualPoint_SETA}  onChange={e => setManualPoint_SETA(e.target.value)} />
            </div>

            <div className="flex justify-center">
              <button className="border-2 p-2 mt-6 rounded-lg">
                Set Main Table
              </button>
            </div>
            <div className="flex justify-center items-center ">
              <button className="border-2 mt-6 m-4 p-2 rounded-lg">
                Set backup 1
              </button>
              <button className="border-2 m-4 mt-6 p-2 rounded-lg">
                Set backup 2
              </button>
              <button className="border-2 m-4 mt-6 p-2 rounded-lg">
                Set backup 3
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TableLeft;
