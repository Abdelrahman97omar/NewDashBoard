import { useRosConnection } from "../../../connection-provider";

const Control=()=>{
  const { publishTopic } = useRosConnection();


    const handleSetManual=()=>{
    }
    const handleGoHome=()=>{
        publishTopic("/go_home",
           "std_msgs/Int32", {
          data: 1,
        });
   
    }
    const handleResume=()=>{
    }
    return(
        <>
            <div className="border-2 border-gray-700 grid grid-cols-1 grid-rows-3 h-full">
                <div className="border-2 border-gray-700 h-full flex justify-around items-center">
                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8"
                    onClick={handleSetManual}>Set Manual</button>

                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8 bg-orange-500"
                    onClick={handleGoHome}>Go Home</button>

                    <button className="border-2 border-gray-800 rounded-2xl w-full h-[100px] m-8"
                    onClick={handleResume}>Resume</button>
                </div>
                <div className="border-2 border-gray-700 h-full flex justify-center items-center">
                    <p>Set Speed</p>
                    <div>
                        <input className="w-6xl" type="range" min="1" max="100" value="50"  id="myRange"/>
                    </div>
                </div>
                <div className="border-2 border-gray-700 h-full"></div>
            </div>
        </>
    )
}

export default Control;