/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

const port = envVars.PORT || 5000;

let server: any = Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL as string);

    console.log("Connected to DB!!");

    server = app.listen(port, () =>
      console.log(`Server is running on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// unhandled rejection error
process.on("unhandledRejection", () => {
  console.log("Unhandled rejection error detected... Server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// example unhandled rejection error
// Promise.reject(new Error(" I forgot to catch this error!"));

process.on("uncaughtException", () => {
  console.log("Uncaught exception error detected... Server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// example uncaught rejection error
// throw new Error("I forgot to handle this local error!");

process.on("SIGINT", () => {
  console.log("Sigint signal received... Server shutting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// There is occoured 3 types of unhandled  error
/**
 *
 * 1. unhandled rejection error (promise related error)
 * 2. uncaught rejection error (unexpected code error)
 * 3. Signal termination error (SIGTERM error)
 *
 */
