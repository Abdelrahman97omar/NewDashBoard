export const getEventpointsList = async () => {
  try {
    const res = await fetch(
      `http://${window.location.hostname}:8001/eventMode/getAllPointsFiles`,
      { method: "GET" }
    );
    if (!res.ok) {
      console.error(`Server error: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch event points list:", error);
    return [];
  }
};

export const getpointsPool = async (pointsFilessLists: any) => {
  // const res = await fetch(
  //   `http://${window.location.hostname}:8001/eventMode/getPointsPool/${pointsFilessLists}`,
  //   { method: "GET" }
  // );
  if (pointsFilessLists === undefined || pointsFilessLists === null) {
    console.error("filenumber is not set yet");
    return;
  }
  const res = await fetch(
    `http://${window.location.hostname}:8001/getPointsPool/${filenumber}`
  );
  const data = await res.json();
  console.log("The points pool is:", data);
  return data;
};

export const handleclearPoint = async (currentPointFile: string) => {
  await fetch(
    `http://${window.location.hostname}:8001/eventMode/clearPoint/${currentPointFile}`,
    {
      method: "PATCH",
    }
  );
};

export const handleEditPoint = async (
  currentPointFile: string,
  choosenpointsPool: Number,
  X: String,
  Y: String,
  Seta: String
) => {
  await fetch(
    `http://${window.location.hostname}:8001/eventMode/editPoint/${currentPointFile}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choosenpointsPool,
        X,
        Y,
        Seta,
      }),
    }
  );
};

export const addNewPoint = async () => {
  await fetch(`http://${window.location.hostname}:8001/eventMode/addNewPoint`, {
    method: "PUT",
  });
  getEventpointsList();
};

export const removePoint = async (currentPointFile: string) => {
  console.log("the currnet files are", currentPointFile);
  await fetch(
    `http://${window.location.hostname}:8001/eventMode/deletePoint/${currentPointFile}`,
    {
      method: "DELETE",
    }
  );
  getEventpointsList();
};
