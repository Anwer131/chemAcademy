const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const compressPdf = async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return next(); // Skip if no file or not a PDF
    }

    // Read the original PDF file
    const originalPdfBytes = fs.readFileSync(req.file.path);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(originalPdfBytes);

    // Remove unnecessary objects to reduce file size (basic compression)
    const pages = pdfDoc.getPages();
    pages.forEach((page) => page.cleanup());

    // Save the compressed PDF
    const compressedPdfBytes = await pdfDoc.save();

    // Write the compressed file back
    fs.writeFileSync(req.file.path, compressedPdfBytes);

    console.log("PDF compressed successfully.");
    next();
  } catch (error) {
    console.error("Error compressing PDF:", error);
    next(error);
  }
};

module.exports = compressPdf;
