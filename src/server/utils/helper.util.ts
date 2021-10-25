import PDFDocument from "pdfkit";
import fs from "fs";

const createPdf = (text: string, fileName: string) => {
  console.log({ text });
  // Create a document
  const doc = new PDFDocument();

  console.log({ doc });
  doc.pipe(fs.createWriteStream(fileName));
  doc.text(text);
  doc.end();
};

const helper = {
  createPdf,
};

export default helper;
