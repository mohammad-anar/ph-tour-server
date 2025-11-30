"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
const port = env_1.envVars.PORT || 5000;
let server = http_1.Server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to DB!!");
        server = app_1.app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
};
(async () => {
    await (0, redis_config_1.connectRedis)();
    await startServer();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
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
//# sourceMappingURL=server.js.map