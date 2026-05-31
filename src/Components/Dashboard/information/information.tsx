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
    setRobotName("Duet");
    // const fetchUserFromBackend = async () => {
    //   const getUser = await fetch(`http://${window.location.hostname}:8001/getUser`);
    //   const username = await getUser.json();
    //   if (username === "duet") { setRobotName("Duet"); setFileName("Duet"); }
    //   else if (username === "mozo") { setRobotName("Mozo"); setFileName("Mozo"); }
    // };
    // fetchUserFromBackend();
  }, []);

  const handleSetManualGuide = () => {
    if (robotName === fileName) return;
    setNumPages(0);
    setFileName(`${robotName}`);
  };

  const handleSetRobotCatalog = () => {
    setNumPages(0);
    setFileName(`${robotName}Catalog`);
  };

  // if (robotName) {
  //   return (
  //      <div className="h-full flex flex-col sm:flex-row overflow-hidden gap-4">
  //       {/* Sidebar buttons */}
  //       <div className="flex sm:flex-col gap-3 sm:gap-10 px-2 sm:px-0 sm:ml-4 sm:w-48 lg:w-64 shrink-0 py-4 sm:py-10">
  //         <button
  //           className="shadow-md shadow-black/50 h-14 sm:h-20 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-base lg:text-2xl font-bold transition
  //             duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
  //           onClick={handleSetManualGuide}
  //         >
  //           Manual Guide
  //         </button>
  //         <button
  //           className="shadow-md shadow-black/50 h-14 sm:h-20 w-full rounded-3xl bg-[#E8E8E9] text-[#09203E] text-base lg:text-2xl font-bold transition
  //             duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
  //           onClick={handleSetRobotCatalog}
  //         >
  //           Robot Catalog
  //         </button>
  //       </div>

  //       {/* PDF viewer */}
  //       <div className="flex-1 min-w-0 shadow-inner py-4 lg:py-10 bg-gray-100 rounded-2xl overflow-hidden">
  //         <div className="px-3 lg:px-5 h-full bg-gray-100 overflow-y-auto">
  //           <Document
  //             file={`/${fileName}.pdf`}
  //             className="rounded-2xl"
  //             onLoadSuccess={onDocumentLoadSuccess}
  //             onLoadError={(error) => console.error("PDF load error:", error)}
  //           >
  //             {Array.from({ length: numPages }, (_, index) => (
  //               <Page
  //                 key={index + 1}
  //                 pageNumber={index + 1}
  //                 renderTextLayer={true}
  //                 renderAnnotationLayer={true}
  //               />
  //             ))}
  //           </Document>
  //         </div>
  //       </div>

  //     </div>
  //   );
  // }
  if (robotName) {
    return (
      <div className="h-full overflow-hidden flex flex-col sm:flex-row">

        {/* Sidebar buttons — fixed, never scrolls */}
        <div className="flex sm:flex-col gap-3 sm:gap-6 lg:gap-10 px-2 sm:px-3 lg:px-4
                        shrink-0 py-3 sm:py-6 lg:py-10
                        sm:w-36 md:w-44 lg:w-64
                        border-b sm:border-b-0 sm:border-r border-gray-200">
          <button
            className="shadow-md shadow-black/50 h-12 sm:h-16 lg:h-20 w-full rounded-2xl lg:rounded-3xl
                       bg-[#E8E8E9] text-[#09203E] text-xs sm:text-sm md:text-base lg:text-2xl
                       font-bold transition duration-100 active:scale-90
                       active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
            onClick={handleSetManualGuide}
          >
            Manual Guide
          </button>
          <button
            className="shadow-md shadow-black/50 h-12 sm:h-16 lg:h-20 w-full rounded-2xl lg:rounded-3xl
                       bg-[#E8E8E9] text-[#09203E] text-xs sm:text-sm md:text-base lg:text-2xl
                       font-bold transition duration-100 active:scale-90
                       active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
            onClick={handleSetRobotCatalog}
          >
            Robot Catalog
          </button>
        </div>

        {/* PDF viewer — flex-1 + min-h-0 is the key: allows shrinking so only this area scrolls */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col
                        bg-gray-100 rounded-2xl m-2 sm:m-3 lg:m-4
                        shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex-1 min-h-0 overflow-y-auto px-3 lg:px-5 py-4 lg:py-10
                          [&::-webkit-scrollbar]:hidden">
            <Document
              file={fileName ? `/${fileName}.pdf` : null}
              className="rounded-2xl"
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
