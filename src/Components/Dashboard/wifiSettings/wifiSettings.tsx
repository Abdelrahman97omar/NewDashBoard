import { useEffect,useState } from "react";
const WifiSettings=()=>{
const [wifiPassword,setWifiPassword]= useState("")

useEffect(()=>{
    const get_wifi_list=async()=>{
        const res = await fetch(`http://${window.location.hostname}:8001/settings/wifi/getNetworks`, {
            method: "GET",
          });
          const data = await res.json();
          console.log(data);
    }
    get_wifi_list()
},[])

const setWifiBackend=async()=>{

    const res = await fetch (`http://${window.location.hostname}:8001/settings/wifi/connect`,{method:"PUT"}) 
    
}


const wifiConnectbuttonhandler=()=>{

}



    return(<>
        <div className="flex items-center ">

            {/* <input value={wifiPassword} onChange={setWifiPassword()}> </input>
            <button onClick={wifiConnectbuttonhandler}> Connect</button> */}

        </div>

    </>)
}
export default WifiSettings;
