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
      // else setRobotName(null)
    };
    fetchUserFromBackend();
  }, []);
  if (robotName) {
    return (
      <div className="h-full grid grid-cols-[100px_1fr] overflow-hidden flex justify-center">
        <div className=" flex-col justify-center">
          {/* <button
            className="border shadow-lg shadow-black/50 h-35 w-90 rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            User Guide
          </button>
          <button
            className="border shadow-lg shadow-black/50 h-35 w-90 rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            User Manual
          </button>
          <button
            className="border shadow-lg shadow-black/50 h-35 w-90 rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
          >
            Catalog
          </button> */}
        </div>
        <div className="h-screen pl-130 w-full overflow-y-auto">
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
    );
  }
}

export default Information;
