import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.get("/invoice/:paymentId", PaymentController.getInvoiceDownloadUrl);
router.get("/validate-payment", PaymentController.paymentValidate);

export const PaymentRoutes = router;
