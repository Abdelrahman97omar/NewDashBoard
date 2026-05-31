import { useEffect, useState } from "react";

const WifiSettings = () => {
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifilist, setWifilist] = useState<string[]>([]);
  const [SSID, setSSID] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [connectStatus, setConnectStatus] = useState<"idle" | "success" | "error">("idle");

  const get_wifi_list = async () => {
    setIsScanning(true);
    setWifilist([]);
    try {
      const res = await fetch(
        `http://${window.location.hostname}:8001/settings/wifi/getNetworks`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Failed to fetch networks");
      const data = await res.json();
      setWifilist(data);
    } catch (error) {
      console.error("Failed to scan networks:", error);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    get_wifi_list();
  }, []);

  const setWifiBackend = async () => {
    setIsConnecting(true);
    setConnectStatus("idle");
    try {
      const res = await fetch(
        `http://${window.location.hostname}:8001/settings/wifi/connect`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ssid: SSID, password: wifiPassword }),
        }
      );
      if (!res.ok) throw new Error("Connection failed");
      setConnectStatus("success");
    } catch (error) {
      console.error("Failed to connect:", error);
      setConnectStatus("error");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectButton = () => {
    if (!SSID) {
      alert("Please select a network");
      return;
    }
    if (!wifiPassword.trim()) {
      alert("Please enter a valid WiFi password");
      return;
    }
    setWifiBackend();
  };

  const handleDownloadLogs = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(
        `http://${window.location.hostname}:8001/downloadLogs`
      );
      if (!res.ok) {
        alert("Log file not available");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "latest-stats.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download logs");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 h-full">

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#09203E] tracking-wide">
          Network Settings
        </h2>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-wrap gap-6 items-end">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#09203E] uppercase tracking-wider">
                Network
              </label>
              <select
                className="border border-gray-300 w-30 md:w-48 h-11 rounded-xl px-3
                 bg-gray-50 text-[#09203E] focus:outline-none focus:ring-2 focus:ring-[#F17137] truncate"
                value={SSID}
                onChange={(e) => setSSID(e.target.value)}
              >
                {wifilist.length === 0 ? (
                  <option value="">
                    {isScanning ? "Scanning..." : "No networks found"}
                  </option>
                ) : (
                  <>
                    <option value="" disabled>
                      Select Network
                    </option>
                    {wifilist.map((x) => (
                      <option value={x} key={x}>
                        {x}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#09203E] uppercase tracking-wider">
                Password
              </label>
              <input
                className="border border-gray-300 w-30 truncate md:w-48 h-11 rounded-xl px-3 bg-gray-50 text-[#09203E] focus:outline-none focus:ring-2 focus:ring-[#F17137]"
                value={wifiPassword}
                type="password"
                placeholder="Enter password"
                onChange={(e) => {setWifiPassword(e.target.value)}}
              />
            </div>

            <button
              className="h-15 md:h-11 px-6 rounded-xl bg-[#E8E8E9] text-[#09203E] 
              font-semibold shadow-sm border border-gray-200 transition 
              duration-100 active:scale-95 active:bg-[#F17137] active:text-white disabled:opacity-50"
              onClick={get_wifi_list}
              disabled={isScanning}
            >
              {isScanning ? "Scanning..." : "Scan Networks"}
            </button>

            <button
              className="h-11 px-6 rounded-xl bg-[#09203E] text-white font-semibold shadow-sm transition duration-100 active:scale-95 active:bg-[#F17137] disabled:opacity-50"
              onClick={handleConnectButton}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </button>

            {connectStatus === "success" && (
              <span className="text-green-600 font-semibold text-sm">
                Connected successfully
              </span>
            )}
            {connectStatus === "error" && (
              <span className="text-red-500 font-semibold text-sm">
                   Connection failed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#09203E] tracking-wide">
          System Logs
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-center md:text-left text-[#09203E]">
                Latest Activity Report
              </p>
              <p className="text-sm text-center md:text-left text-gray-400">
                Download the robot working hours logs as a PDF
              </p>
            </div>
            <button
              className="h15 mt-3 md:h-11 px-6 rounded-xl bg-[#E8E8E9] text-[#09203E] font-semibold shadow-sm border border-gray-200 transition duration-100 active:scale-95 active:bg-[#F17137] active:text-white disabled:opacity-50"
              onClick={handleDownloadLogs}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download Logs"}
            </button>
          </div>
      </div>

    </div>
  );
};

export default WifiSettings;