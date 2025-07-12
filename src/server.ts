import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuparAdmin } from "./app/utility/seedSuperAdmin";

let server: Server;

const stateServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connect to DB");

    server = app.listen(envVars.PORT, () => {
      console.log(`server is listening ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await stateServer();
  await seedSuparAdmin();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM Ditected .... server shutting off");
  if (server) {
    server.close();
    process.exit;
  }
  process.exit;
});
// unhandledRejection;
process.on("unhandledRejection", () => {
  console.log(" unhandle Rejecton detected.....Server shutting off ");

  if (server) {
    server.close();
    process.exit;
  }
  process.exit;
});
// uncaughtException
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Detected.....server shutting off", err);
  if (server) {
    server.close();
    process.exit;
  }
  process.exit;
});
