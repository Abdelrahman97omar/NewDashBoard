export const getEventpointsList = async () => {
  const res = await fetch(
    `http://${window.location.hostname}:8001/eventMode/getAllPointsFiles`,
    { method: "GET" }
  );
  const data = await res.json();
  return data;
};

export const getpointsPool = async (pointsFilessLists: any) => {
    const res = await fetch(
      `http://${window.location.hostname}:8001/eventMode/getPointsPool/${pointsFilessLists}`,
      { method: "GET" }
    );
    const data = await res.json();
    console.log("The points pool is:", data)
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

export const handleAddNewPoint = async () => {
  const res = await fetch(
    `http://${window.location.hostname}:8001/eventMode/addNewPoint`,
    {
      method: "PUT",
    }
  );
  getEventpointsList();
};

export const handleRemovePoint = async (currentPointFile: string) => {
  console.log("the currnet files are", currentPointFile);
  await fetch(
    `http://${window.location.hostname}:8001/eventMode/deletePoint/${currentPointFile}`,
    {
      method: "DELETE",
    }
  );
  getEventpointsList();
};
