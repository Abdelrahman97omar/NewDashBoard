const SettingS=()=>{
    return (
        <>
        <div className="grid grid-cols-3 pt-10">
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20">
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Clear Map
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Resume Map
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Next Option On
            </button>
          </div>
  
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20">
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Save Map
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Pause Mapping
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Clear Virtual Path
            </button>
          </div>
          <div className="grid grid-cols-1 py-8 px-20 gap-y-20 ">
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Load Map
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Create Virtual Path
            </button>
            <button className="border h-25 w-70 rounded-3xl shadow-2xl">
              Set Motor On
            </button>
          </div>
        </div>
        </>
      );
}
export default SettingS;