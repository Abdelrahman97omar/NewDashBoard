import { useEffect } from "react";
const WifiSettings=()=>{

useEffect(()=>{
    const get_wifi_list=async()=>{
        const res = await fetch(`http://${window.location.hostname}:8001/settings/wifi/getNetworks`, {
            method: "GET",
            headers:{"Hi":"HI"},
          });
          const data = await res.json();
          console.log(data);
    }
    get_wifi_list()
},[])

    return(<>
    <p>Hi</p>
    </>)
}
export default WifiSettings;
