import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/router";
import { globalErrorHander } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    massage: "Welcome To Ph Tour Management System",
  });
});
app.use(globalErrorHander);
app.use(notFound);

export default app;
