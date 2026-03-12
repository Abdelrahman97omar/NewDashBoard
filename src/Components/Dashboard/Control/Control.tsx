const Control=()=>{

    return(
        <>
            <div className="border-2 border-gray-700 grid grid-cols-1 grid-rows-3 h-full">
                <div className="border-2 border-gray-700 h-full flex justify-around items-center">
                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8 ">Set Manual</button>
                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8 ">Go Home</button>
                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8 ">Resume</button>
                </div>
                <div className="border-2 border-gray-700 h-full">Set Speed</div>
                <div className="border-2 border-gray-700 h-full"></div>
            </div>
        </>
    )
}

export default Control;