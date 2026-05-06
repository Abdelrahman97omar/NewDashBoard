import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Information = () => {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="border-2 flex justify-center overflow-hidden">
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <Document
        file="/Duet.pdf"
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
};

export default Information;