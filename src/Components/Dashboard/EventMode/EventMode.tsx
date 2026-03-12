const EventMode=()=>{

    const PointList=[1,2,3,4,5,6]
    return(<>
    <div className="flex border-2 justify-between">
        <button> Append Points</button>
        <select className="border-1 bg-blue-600 w-1/2">
            {PointList.map((pointNo)=><option>{pointNo}</option>)}
        </select>
    </div>
    </>)
}

export default EventMode;