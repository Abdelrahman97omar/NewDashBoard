import { useRosConnection } from "../../../connection-provider";
import { useEffect, useState } from "react";
const Control=()=>{
    const { publishTopic } = useRosConnection();
    const [manualState,setManualState]= useState(0)
    const [resumeState,setresumeState]= useState(0)
    const [sliderValue,setSliderValue]= useState(50)

    useEffect(()=>{
        const  getRobotSpped= async()=>{
            const res= await fetch (`http://${window.location.hostname}:8001/control/getRobotSpeed`,
                {
                    method:"GET"
                })
            const data=await res.json()
            console.log(data)
            console.log(typeof(data))
            setSliderValue(Number(data))
            
        }
        getRobotSpped()
    },[])
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const new_speed = Number(event.target.value);
        if(new_speed <= 49) return;
    
        setSliderValue(new_speed);
        publishTopic("/set_speed", "std_msgs/Float32", { data: new_speed });
        console.log(new_speed);
    };

    const handleSetManual=()=>{
        let newManualFlag = 0
        if (manualState===1){
            newManualFlag=0
            setManualState(0)
        }
        else if (manualState===0)
        {
            newManualFlag=1
            setManualState(1)
        }
        publishTopic("/manual_flag",
            "std_msgs/Int32", {
           data: newManualFlag,
        });
    }
    const handleGoHome=()=>{
        publishTopic("/go_home",
           "std_msgs/Int32", {
          data: 1,
        });
   
    }
    const handleResume=()=>{
        let newResumeState = 0

        if (resumeState===1){
            newResumeState=0
            setresumeState(0)
        }
        else if (resumeState===0)
        {
            newResumeState=1
            setresumeState(1)
        }
        publishTopic("/resume",
            "std_msgs/Int32", {
           data: newResumeState,
        });
    }
    return(
        <>
            <div className="grid grid-cols-1 grid-rows-3 h-full">
                <div className=" flex justify-around items-center h-full">
                    <button className={manualState===1?"controlButtons":"pressedControlButtons"}
                    onClick={handleSetManual}>Set Manual</button>

                    <button className="controlButtons"
                    onClick={handleGoHome}>Go Home</button>

                    <button className={resumeState===1?"controlButtons":"pressedControlButtons"}
                    onClick={handleResume}>Resume</button>
                </div>


                <div className="h-30  grid-rows-[15_1fr]  Cgray mx-9 rounded-3xl">
                    <div className="flex justify-center items-center mt-5">
                        <p className="mr-6 text-3xl font-bold text-[#09203E]">Speed</p>
                        <div>
                            <input className="w-4xl Cgray h-6 accent-[#09203E] "
                            type="range"
                            id="range-slider"
                            min="0"
                            max="100"
                            step="1"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            />
                        </div>
                    </div>
                    <div className="border-2 ">
                        <p className="text-[#09203E] text-3xl">{sliderValue}%</p>
                    </div>
                </div>


                <div className=" h-full border-2"></div>
            </div>
        </>
    )
}

export default Control;