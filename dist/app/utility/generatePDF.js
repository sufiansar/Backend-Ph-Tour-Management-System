"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Starting PDF generation with data:", invoiceData);
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(buffer);
                console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");
                resolve(pdfBuffer);
            });
            doc.on("error", (err) => {
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
    }
    catch (error) {
        console.error("PDF creation error:", error);
        console.error("Error stack:", error.stack);
        throw new AppError_1.default(500, `PDF creation error: ${error.message}`, error.stack || "");
    }
});
exports.generatePdf = generatePdf;
