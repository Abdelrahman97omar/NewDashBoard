import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Information = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [robotName, setRobotName] = useState<string | null>("duet");
  // const [robotName , setRobotName]=useState<string | null>("");
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchUserFromBackend = async () => {
      const getUser = await fetch(
        `http://${window.location.hostname}:8001/getUser`
      );
      const username = await getUser.json();
      if (username === "duet") setRobotName("Duet");
      else if (username === "mozo") setRobotName("Mozo");
      else setRobotName("Duet");
    };
    fetchUserFromBackend();
  }, []);
  if (robotName) {
    return (
      <div className="h-full grid grid-cols-[300px_1fr] overflow-hidden  justify-center">
        {/* <div className="border bg-gray-100 rounded-2xl shadow-inner py-10 flex flex-col justify-between h-full px-2"> */}
        <div className=" bg-gray-100 rounded-2xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)] py-10 flex flex-col justify-between h-full px-2">
          <button
            className=" shadow-lg  shadow-black/50 h-35 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            User Guide
          </button>
          <button
            className=" shadow-lg shadow-black/50 h-35 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            User Manual
          </button>
          <button
            className="  shadow-lg shadow-black/50 h-35 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            Catalog
          </button>
        </div>

        <div className=" shadow-inner h-150 w-260 ml-15 bg-gray-100 rounded-2xl  overflow-y-auto overflow-hidden">
          <div className="px-5 py-5">
          <Document
            file={`/${robotName}.pdf`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("PDF load error:", error)}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={index + 1}
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            ))}
          </Document>
          </div>
        </div>
      </div>
    );
  }
};

export default Information;
