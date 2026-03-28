import type { Numbers } from "@mui/icons-material";
import { useRosConnection } from "../../../connection-provider";
import { useEffect, useState } from "react";

const Table = () => {
  const [manualPoint_X, setManualPoint_X] = useState("0");
  const [manualPoint_Y, setManualPoint_Y] = useState("0");
  const [manualPoint_SETA, setManualPoint_SETA] = useState("0");

  const [tableList, setTableList] = useState([]);
  const [selectedTable, setselectedTable] = useState(0);

  const [saved_X, setSaved_X] = useState("0");
  const [saved_Y, setSaved_Y] = useState("0");
  const [saved_SETA, setSaved_SETA] = useState("0");

  const [B1_saved_X, B1_setSaved_X] = useState("0");
  const [B1_saved_Y, B1_setSaved_Y] = useState("0");
  const [B1_saved_SETA, B1_setSaved_SETA] = useState("0");

  const [B2_saved_X, B2_setSaved_X] = useState("0");
  const [B2_saved_Y, B2_setSaved_Y] = useState("0");
  const [B2_saved_SETA, B2_setSaved_SETA] = useState("0");

  const [B3_saved_X, B3_setSaved_X] = useState("0");
  const [B3_saved_Y, B3_setSaved_Y] = useState("0");
  const [B3_saved_SETA, B3_setSaved_SETA] = useState("0");

  const { publishTopic } = useRosConnection();

  const fetchTables = async () => {
    const res = await fetch("http://127.0.0.1:8001/tablemode/gettable", {
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

  const ClicksetManualPoint_X = () => {
    if (manualPoint_X === "0") {
      setManualPoint_X("");
    } else return;
  };
  const ClicksetManualPoint_Y = () => {
    if (manualPoint_Y === "0") {
      setManualPoint_Y("");
    } else return;
  };
  const ClicksetManualPoint_SETA = () => {
    if (manualPoint_SETA === "0") {
      setManualPoint_SETA("");
    } else return;
  };

  const blursetManualPoint_X = () => {
    if (manualPoint_X === "") {
      setManualPoint_X("0");
    } else return;
  };
  const blursetManualPoint_Y = () => {
    if (manualPoint_Y === "") {
      setManualPoint_Y("0");
    } else return;
  };
  const blursetManualPoint_SETA = () => {
    if (manualPoint_SETA === "") {
      setManualPoint_SETA("0");
    } else return;
  };

  const handleAddNewTable = () => {
    const addNewTable = async () => {
      const res = await fetch("http://127.0.0.1:8001/tablemode/addnewtable", {
        method: "PUT",
      });
    };
    addNewTable();
    fetchTables();
  };

  useEffect(() => {
    const getTablepointValues = async () => {
      const res = await fetch(
        `http://127.0.0.1:8001/tablemode/getpoints/${selectedTable}`
      );
      const data = JSON.parse(await res.json());
      setSaved_X(data[1]);
      setSaved_Y(data[2]);
      setSaved_SETA(data[3]);
      B1_setSaved_X(data[4]);
      B1_setSaved_Y(data[5]);
      B1_setSaved_SETA(data[6]);
      B2_setSaved_X(data[7]);
      B2_setSaved_Y(data[8]);
      B2_setSaved_SETA(data[9]);
      B3_setSaved_X(data[10]);
      B3_setSaved_Y(data[11]);
      B3_setSaved_SETA(data[12]);
    };
    getTablepointValues();
  }, [selectedTable]);

  const setNewPoints = async (sentPointsType: string) => {
    await fetch(
      `http://127.0.0.1:8001/tablemode/updatepoints/${selectedTable}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pointsType: sentPointsType,
          points: [
            Number(manualPoint_X),
            Number(manualPoint_Y),
            Number(manualPoint_SETA),
          ],
        }),
      }
    );
  };

  const handleDeleteTable = () => {
    const removeLastTable = async () => {
      await fetch("http://127.0.0.1:8001/tablemode/removetable", {
        method: "DELETE",
      });
    };

    removeLastTable();
    fetchTables();
  };

  const handleGoToTable = () => {
    const tableNumber_float = selectedTable.toFixed(1);
    console.log("publishing..", tableNumber_float);
    publishTopic("/table_no", "std_msgs/Float32", {
      data: tableNumber_float,
    });
  };
  return (
    <div className="grid grid-cols-1 w-full grid-rows-[150px_1fr] gap-3">
      <div className="flex justify-around items-center tableModeBorders">
        <button className=" tableModeButtons" onClick={handleAddNewTable}>
          Add New Table
        </button>
        <button className=" tableModeButtons" onClick={handleSetTableMode}>
          Set Table Mode
        </button>
        <button className=" tableModeButtons" onClick={handleDeleteTable}>
          Remove Last Table
        </button>

        <button className=" tableModeButtons" onClick={handleGoToTable}>
          Go to Table
        </button>

        <div className="flex justify-center items-center">
          <select
            className=" corange w-[300px] rounded-2xl h-[90px]"
            name="cars"
            id="cars"
            value={selectedTable}
            onChange={(e) => getSelectedTableFromList(Number(e.target.value))}
          >
            {tableList.map((no) => (
              <option
                className="bg-white text-2xl text-center"
                value={no}
                key={no}
              >
                Table {no}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className=" grid grid-cols-4 gap-3">
        <div className=" h-full tableModeBorders">
          <p className="tablemodeHeaders">Live Points</p>

          <div className="XYSETA-VALUE-Position">
            <span className="font-bold text-xl mr-10">X:</span>
            <div className="tableModeNumberFieled">0</div>
          </div>
          <div className="XYSETA-VALUE-Position">
            <span className="font-bold text-xl mr-10">Y:</span>
            <div className="tableModeNumberFieled">0</div>
          </div>
          <div className="XYSETA-VALUE-Position">
            <span className="font-bold text-xl mr-10">Theta:</span>
            <div className="tableModeNumberFieled">0</div>
          </div>
          <div className="grid grid-cols-1">
            <button className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg">
              Set Main Table
            </button>
            <button className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg">
              Set backup 1
            </button>
            <button className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg">
              Set backup 2
            </button>
            <button className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg">
              Set backup 3
            </button>
          </div>
        </div>

        <div className="relative  h-full tableModeBorders">
          <p className="tablemodeHeaders">Manual Points</p>
          <div className="XYSETA-VALUE-Position">
            <span className="font-bold text-xl mr-10">X:</span>
            <input
              className="tableModeNumberFieled"
              value={manualPoint_X}
              onBlur={blursetManualPoint_X}
              onFocus={ClicksetManualPoint_X}
              onChange={(e) => setManualPoint_X(e.target.value)}
            />
          </div>
          <div className="XYSETA-VALUE-Position">
            <span className="font-bold text-xl mr-10">Y:</span>
            <input
              className="tableModeNumberFieled"
              value={manualPoint_Y}
              onBlur={blursetManualPoint_Y}
              onFocus={ClicksetManualPoint_Y}
              onChange={(e) => setManualPoint_Y(e.target.value)}
            />
          </div>
          <div className="XYSETA-VALUE-Position">

            <span className="font-bold text-xl mr-10">Theta:</span>
            <input
              className="tableModeNumberFieled"
              value={manualPoint_SETA}
              onBlur={blursetManualPoint_SETA}
              onFocus={ClicksetManualPoint_SETA}
              onChange={(e) => setManualPoint_SETA(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1">
            <button
              className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg"
              onClick={() => setNewPoints("Main")}
            >
              Set Main Table
            </button>
            <button
              className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg"
              onClick={() => setNewPoints("BackUp_1")}
            >
              Set backup 1
            </button>
            <button
              className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg"
              onClick={() => setNewPoints("BackUp_2")}
            >
              Set backup 2
            </button>
            <button
              className="Cgray my-2 mx-14 text-center p-2 w-3/4 rounded-lg text-lg"
              onClick={() => setNewPoints("BackUp_3")}
            >
              Set backup 3
            </button>
          </div>
        </div>

        <div className=" grid grid-cols-1 grid-rows-2 gap-3">
          <div className="tableModeBorders">
            <h1 className="tablemodeHeaders">Main Point</h1>

            <div className="space-y-3 pb-1">
              {/* <div className="flex items-center gap-3  pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">X:</span>
                <div className="tableModeNumberFieled">{saved_X}</div>
              </div>

              {/* <div className="flex items-center gap-3 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">Y:</span>
                <div className="tableModeNumberFieled">{saved_Y}</div>
              </div>

              {/* <div className="flex items-center gap-3 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl">Theta:</span>
                <div className="tableModeNumberFieled">{saved_SETA}</div>
              </div>
            </div>
          </div>
          <div className="tableModeBorders">
            <h1 className="tablemodeHeaders">Backup 2</h1>
            <div className="space-y-3 pb-1">
              {/* <div className="flex items-center gap-9 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">X:</span>
                <div className="tableModeNumberFieled">{B2_saved_X}</div>
              </div>

              {/* <div className="flex items-center gap-9 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">Y:</span>
                <div className="tableModeNumberFieled">{B2_saved_Y}</div>
              </div>

              {/* <div className="flex items-center gap-9 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl">Theta:</span>
                <div className="tableModeNumberFieled">{B2_saved_SETA}</div>
              </div>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-1 grid-rows-2 gap-3">
          <div className="tableModeBorders">
            <h1 className="tablemodeHeaders">Backup 1</h1>
            <div className="space-y-3 pb-1">
              {/* <div className="flex items-center gap-30 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">X:</span>
                <div className="tableModeNumberFieled">{B1_saved_X}</div>
              </div>

              {/* <div className="flex items-center gap-30 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">Y:</span>
                <div className="tableModeNumberFieled">{B1_saved_Y}</div>
              </div>

              {/* <div className="flex items-center gap-30 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl">Theta:</span>
                <div className="tableModeNumberFieled">{B1_saved_SETA}</div>
              </div>
            </div>
          </div>
          <div className="tableModeBorders">
            <h1 className="tablemodeHeaders ">Backup 3</h1>
            <div className="space-y-3 pb-1">
              {/* <div className="flex items-center gap-3 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">X:</span>
                <div className="tableModeNumberFieled">{B3_saved_X}</div>
              </div>

              {/* <div className="flex items-center gap-3 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl mr-10.5">Y:</span>
                <div className="tableModeNumberFieled">{B3_saved_Y}</div>
              </div>

              {/* <div className="flex items-center gap-3 pl-10"> */}
          <div className="XYSETA-VALUE-Position">

                <span className="font-bold text-xl">Theta:</span>
                <div className="tableModeNumberFieled">{B3_saved_SETA}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
