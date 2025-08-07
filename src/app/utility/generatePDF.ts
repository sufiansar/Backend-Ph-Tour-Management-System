/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  try {
    console.log("Starting PDF generation with data:", invoiceData);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk: any) => buffer.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffer);
        console.log(
          "PDF generated successfully, size:",
          pdfBuffer.length,
          "bytes"
        );
        resolve(pdfBuffer);
      });
      doc.on("error", (err: any) => {
        console.error("PDF generation error:", err);
        reject(err);
      });

      //PDF Content
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Transaction ID : ${invoiceData.transactionId}`);
      doc.text(`Booking Date : ${invoiceData.bookingDate}`);
      doc.text(`Customer : ${invoiceData.userName}`);

      doc.moveDown();

      doc.text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guests: ${invoiceData.guestCount}`);
      doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text("Thank you for your booking!", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text("Please keep this invoice for your records.", {
        align: "center",
      });
      doc.moveDown();
      doc.text("For any queries, contact our support team.", {
        align: "center",
      });
      doc.moveDown();
      doc.text("Contact: support@example.com", { align: "center" });

      doc.end();
    });
  } catch (error: any) {
    console.error("PDF creation error:", error);
    console.error("Error stack:", error.stack);
    throw new AppError(
      500,
      `PDF creation error: ${error.message}`,
      error.stack || ""
    );
  }
};
