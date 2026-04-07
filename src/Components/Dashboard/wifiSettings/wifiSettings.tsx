import { useEffect,useState } from "react";
const WifiSettings=()=>{
const [wifiPassword,setWifiPassword]= useState("")
const [wifilist,setWifilist]= useState([])

useEffect(()=>{
    const get_wifi_list=async()=>{
        const res = await fetch(`http://${window.location.hostname}:8001/settings/wifi/getNetworks`, {
            method: "GET",
          });
          const data = await res.json();
          console.log(data);
          setWifilist(data)
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

        <select> {wifilist.map((x)=>(<option key={x}>{x}</option>))}
        </select>

        </div>

    </>)
}
export default WifiSettings;
