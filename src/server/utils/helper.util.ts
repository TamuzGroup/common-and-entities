import PDFDocument from "pdfkit";
import fs from "fs";
import logger from "./logger.util";

const createPdf = (text: string, fileName: string): void => {
  // Create a document

  try {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(fileName));
    doc.text(text);
    doc.end();
  } catch (e) {
    logger.error(e);
  }
};

const helper = {
  createPdf,
};

export default helper;
