import { useEffect, useState } from "react";
const WifiSettings = () => {
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifilist, setWifilist] = useState([]);
  const [SSID, setSSID] = useState("");

  useEffect(() => {
    const get_wifi_list = async () => {
      const res = await fetch(
        `http://${window.location.hostname}:8001/settings/wifi/getNetworks`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      console.log(data);
      setWifilist(data);
    };
    get_wifi_list();
  }, []);

  const setWifiBackend = async () => {
    const res = await fetch(
      `http://${window.location.hostname}:8001/settings/wifi/connect`,
      {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
          ssid: SSID, 
          password: wifiPassword,
        }),
      }
    );
  };



  const handleConnectButton = () => {
    console.log("Buttin is pressed");
    console.log("the ssid is", SSID);
    console.log(wifiPassword);
    if (!wifiPassword.trim()) {
      alert("Please Enter Valid WIFI Password");
    } else {
      setWifiBackend();
    }
  };

  const enterPwHandler = (event: any) => {
    setWifiPassword(event.target.value);
    console.log(wifiPassword);
  };

  return (
    <>
      <div className="grid grid-rows-4 h-full">
        <div className="flex justify-around items-center h-full">


        <select
        className="border-2 w-50 h-15 rounded-2xl"
        value={SSID}
        onChange={(e) => setSSID(e.target.value)}
        >
        {wifilist.length === 0 ? (
            <option className="text-center" value="">
            Scanning Network...
            </option>
        ) : (
            <>
            <option className="text-center" value="" disabled>
                Select Network
            </option>

            {wifilist.map((x) => (
                <option className="text-center" value={x} key={x}>
                {x}
                </option>
            ))}
            </>
        )}
        </select>
          

          <input
            className="border-2 w-50 h-10 rounded-xl text-center"
            value={wifiPassword}
            onChange={enterPwHandler}
          />
          <button className="border-2 w-50 h-15 rounded-3xl bg-[#E8E8E9]" onClick={handleConnectButton}>
            Connect
          </button>
        </div>

        {/* <div className="border-2 h-full"></div>
        <div className="border-2 h-full"></div>
        <div className="border-2 h-full"></div> */}
      </div>
    </>
  );
};
export default WifiSettings;
