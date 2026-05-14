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
  const [robotName, setRobotName] = useState<string | null>("");
  const [fileName, setFileName] = useState<string | null>("");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchUserFromBackend = async () => {
      const getUser = await fetch(
        `http://${window.location.hostname}:8001/getUser`
      );
      const username = await getUser.json();
      if (username === "duet") {
        setRobotName("Duet");
        setFileName("Duet");
      } else if (username === "mozo") {
        setRobotName("Mozo");
        setFileName("Mozo");
      }
    };
    fetchUserFromBackend();
  }, []);

  const handleSetManualGuide = () => {
    if (robotName === fileName)
    {
      return
    }
    setNumPages(0);
    console.log("Robot name is", robotName);
    setFileName(`${robotName}`);
  };
  const handleSetRobotCatalog = () => {
    setNumPages(0);
    setFileName(`${robotName}Catalog`);
  };

  if (robotName) {
    return (
      <div className="h-full grid grid-cols-[300px_1fr] overflow-hidden  justify-center">
        <div className="flex h-fit flex-col ml-8 px-4 py-10  rounded-2xl  gap-y-10">
          <button
            className="shadow-md shadow-black/50 h-20 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
            duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
            onClick={handleSetManualGuide}
          >
            Manual Guide
          </button>
          <button
            className="shadow-md  shadow-black/50 h-20 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
            duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
            onClick={handleSetRobotCatalog}
          >
            Robot Catalog
          </button>
        </div>

        <div className=" shadow-inner h-150 w-260 ml-15 py-10 bg-gray-100 rounded-2xl">
          <div className="px-5  h-full bg-gray-100 overflow-y-auto overflow-hidden">
            <Document
              file={`/${fileName}.pdf`}
              className="rounded-2xl display-none"
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
