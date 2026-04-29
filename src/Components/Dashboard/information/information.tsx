import { useEffect } from "react";
// import ReactPDF;
import { Document, Page } from "react-pdf";
import dpdf from "/Duet.pdf";
const Information = () => {
  useEffect(() => {
    console.log("the info tab");
  });
  return (
    <>
      <h1>The info tab</h1>
      {/* <ReactPDF
  file={{
    data: dpdf
  }}
/> */}
      <Document file={{ data: dpdf }}>
        <Page pageNumber={1} />
      </Document>
    </>
  );
};

export default Information;
